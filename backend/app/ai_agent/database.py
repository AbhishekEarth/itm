"""pgvector-backed vector store for RAG pipeline.

Persists to Postgres (Supabase), so embeddings survive Cloud Run cold starts,
container rotations, and redeploys — unlike the previous ChromaDB-on-/tmp setup.

Keeps the same public interface as the legacy ChromaDB wrapper so callers
(scrapers, agent, routers) don't need any changes.
"""
from __future__ import annotations

import hashlib
import json
import logging
from typing import Any

from sentence_transformers import SentenceTransformer
from sqlalchemy import text

from app.ai_agent.config import settings
from app.core.database import engine as _engine

logger = logging.getLogger("ai-agent.database")

_VECTOR_DIM = 384  # all-MiniLM-L6-v2 embedding size
_TABLE = "agent_documents"

_DDL = [
    "CREATE EXTENSION IF NOT EXISTS vector",
    f"""CREATE TABLE IF NOT EXISTS {_TABLE} (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        embedding vector({_VECTOR_DIM}) NOT NULL,
        metadata JSONB NOT NULL DEFAULT '{{}}'::jsonb,
        source TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    )""",
    f"CREATE INDEX IF NOT EXISTS {_TABLE}_embedding_idx ON {_TABLE} USING hnsw (embedding vector_cosine_ops)",
    f"CREATE INDEX IF NOT EXISTS {_TABLE}_source_idx ON {_TABLE} (source)",
]


def _format_vec(vec: list[float]) -> str:
    """pgvector accepts vectors as '[0.1,0.2,...]' string literals."""
    return "[" + ",".join(f"{x:.7f}" for x in vec) + "]"


class VectorDatabase:
    """Vector store interface backed by Postgres + pgvector."""

    def __init__(self):
        self._embedding_model: SentenceTransformer | None = None
        self._initialized = False

    async def initialize(self) -> None:
        """Ensure pgvector extension, table and indexes exist."""
        try:
            with _engine.begin() as conn:
                for stmt in _DDL:
                    conn.execute(text(stmt))
            logger.info(
                "pgvector vector store ready",
                extra={"table": _TABLE, "dim": _VECTOR_DIM},
            )
            self._initialized = True
        except Exception as e:
            logger.error("Failed to initialize pgvector store", exc_info=e)
            raise

    def _get_embedding_model(self) -> SentenceTransformer:
        if self._embedding_model is None:
            self._embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        return self._embedding_model

    def _compute_id(self, text_: str, source: str = "", chunk_index: int = 0) -> str:
        raw = f"{source}:{chunk_index}:{text_[:100]}"
        return hashlib.md5(raw.encode()).hexdigest()

    def add_documents(
        self,
        texts: list[str],
        metadatas: list[dict[str, Any]] | None = None,
        ids: list[str] | None = None,
        source: str = "",
    ) -> int:
        if not self._initialized:
            logger.error("Vector store not initialized")
            return 0
        if not texts:
            return 0

        if metadatas is None:
            metadatas = [{"source": source} for _ in texts]
        else:
            for m in metadatas:
                m.setdefault("source", source)

        if ids is None:
            ids = [self._compute_id(t, source, i) for i, t in enumerate(texts)]

        try:
            embeddings = (
                self._get_embedding_model()
                .encode(texts, show_progress_bar=False)
                .tolist()
            )

            upsert_sql = text(
                f"""
                INSERT INTO {_TABLE} (id, content, embedding, metadata, source)
                VALUES (:id, :content, CAST(:emb AS vector), CAST(:meta AS jsonb), :source)
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    embedding = EXCLUDED.embedding,
                    metadata = EXCLUDED.metadata,
                    source = EXCLUDED.source
                """
            )

            total = 0
            with _engine.begin() as conn:
                for id_, txt, emb, meta in zip(ids, texts, embeddings, metadatas):
                    conn.execute(
                        upsert_sql,
                        {
                            "id": id_,
                            "content": txt,
                            "emb": _format_vec(emb),
                            "meta": json.dumps(meta, default=str),
                            "source": source,
                        },
                    )
                    total += 1

            logger.info(
                "Documents upserted",
                extra={"count": total, "source": source},
            )
            return total
        except Exception as e:
            logger.error("Failed to add documents", exc_info=e)
            return 0

    def similarity_search(
        self,
        query: str,
        k: int | None = None,
        filter_metadata: dict[str, str] | None = None,
    ) -> list[dict[str, Any]]:
        if not self._initialized:
            logger.error("Vector store not initialized")
            return []

        k = k or settings.RETRIEVAL_K

        try:
            q_emb = self._get_embedding_model().encode(query).tolist()
            q_vec = _format_vec(q_emb)

            params: dict[str, Any] = {"q_vec": q_vec, "k": int(k)}
            where_clause = ""
            if filter_metadata:
                conds = []
                for i, (key, val) in enumerate(filter_metadata.items()):
                    pk = f"mk_{i}"
                    pv = f"mv_{i}"
                    conds.append(f"metadata->>:{pk} = :{pv}")
                    params[pk] = key
                    params[pv] = val
                where_clause = "WHERE " + " AND ".join(conds)

            sql = text(
                f"""
                SELECT content, metadata, 1.0 - (embedding <=> CAST(:q_vec AS vector)) AS score
                FROM {_TABLE}
                {where_clause}
                ORDER BY embedding <=> CAST(:q_vec AS vector)
                LIMIT :k
                """
            )
            with _engine.connect() as conn:
                rows = conn.execute(sql, params).fetchall()

            return [
                {
                    "content": r[0],
                    "metadata": dict(r[1]) if r[1] is not None else {},
                    "score": float(r[2]),
                }
                for r in rows
            ]
        except Exception as e:
            logger.error("Failed to search vector store", exc_info=e)
            return []

    def count_documents(self) -> int:
        if not self._initialized:
            return 0
        try:
            with _engine.connect() as conn:
                r = conn.execute(text(f"SELECT COUNT(*) FROM {_TABLE}")).fetchone()
                return int(r[0]) if r else 0
        except Exception:
            return 0

    def delete_collection(self) -> bool:
        try:
            with _engine.begin() as conn:
                conn.execute(text(f"TRUNCATE TABLE {_TABLE}"))
            logger.info("Vector store truncated")
            return True
        except Exception as e:
            logger.error("Failed to truncate vector store", exc_info=e)
            return False

    @property
    def is_initialized(self) -> bool:
        return self._initialized


vector_db = VectorDatabase()
