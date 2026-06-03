"""RAG-based conversational agent with NVIDIA Llama 3.1 integration.

Instead of relying on LangChain's create_agent (which needs native tool-calling
support that Llama 3.1 via NVIDIA doesn't provide), this module uses a manual
Retrieval-Augmented Generation pipeline:

1. Classify the user query → pick the right tool & category
2. Call the tool directly to retrieve data
3. Feed (question + retrieved data) to the LLM for a natural-language answer
4. For general/chitchat queries, call the LLM directly without tools
"""
from __future__ import annotations

import asyncio
import logging
import re
import time
from collections import defaultdict
from typing import Any, AsyncGenerator

from langchain_core.messages import HumanMessage, SystemMessage
from tenacity import (
    AsyncRetrying,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential,
)

from app.ai_agent.config import settings
from app.ai_agent.page_links import format_links_markdown, suggest_links
from app.ai_agent.tools import search_knowledge_base, query_database

logger = logging.getLogger("ai-agent.agent")

# ── Greeting patterns — respond instantly without LLM ─────────────────────────
_GREETING_PATTERNS = [
    re.compile(r"^(hi|hii|hey|hello|heyy|heya|howdy|yo|sup)\b", re.IGNORECASE),
    re.compile(r"^(good\s*(morning|afternoon|evening|day)|gm|ge|gn)\b", re.IGNORECASE),
    re.compile(r"^(namaste|vanakkam|nomoshkar|sat\s*sri\s*akaal)\b", re.IGNORECASE),
    re.compile(r"^(thanks?|thank you|thx|ty|tysm|thnx)\b", re.IGNORECASE),
    re.compile(r"^(bye|goodbye|cya|see\s*ya|tata|bye\s*bye)\b", re.IGNORECASE),
    re.compile(r"^(what'?s?\s*up|how'?s?\s*it\s*going|how\s*are\s*you|wassup|sup)\b", re.IGNORECASE),
    re.compile(r"^(ok|okay|k|kk|alright|fine)\s*(thanks|thank\s*you)?$", re.IGNORECASE),
]

_GREETING_RESPONSES = {
    "default": "## 👋 Hello! Welcome to ITM Gwalior Assistant!\n\nI'm here to help you with:\n- **Admissions** & **Fee Structure**\n- **Faculty** & **Departments**\n- **Placements** & **Training**\n- **Courses** & **Syllabus**\n- **Hostel** & **Campus Life**\n- **LMS/ERP** & **Examinations**\n- **Events** & **Notices**\n\nHow can I assist you today? 😊",
    "thanks": "You're welcome! 😊 Feel free to ask if you need any more help with ITM Gwalior information.",
    "bye": "Goodbye! 👋 Have a great day! Feel free to come back anytime you need help with ITM Gwalior.",
    "morning": "Good Morning! 🌅 Welcome to ITM Gwalior Assistant. How can I help you today?",
    "afternoon": "Good Afternoon! ☀️ Welcome to ITM Gwalior Assistant. How can I help you today?",
    "evening": "Good Evening! 🌇 Welcome to ITM Gwalior Assistant. How can I help you today?",
}


def _is_greeting(message: str) -> str | None:
    """Check if a message is a simple greeting and return a response key or None."""
    msg = message.strip()
    for pattern in _GREETING_PATTERNS:
        match = pattern.match(msg)
        if match:
            word = match.group(1).lower()
            if word in ("thanks", "thank", "thx", "ty", "tysm", "thnx"):
                return "thanks"
            if word in ("bye", "goodbye", "cya", "see", "tata"):
                return "bye"
            if word in ("good", "gm"):
                full = msg.lower()
                if "morning" in full:
                    return "morning"
                if "afternoon" in full:
                    return "afternoon"
                if "evening" in full:
                    return "evening"
            return "default"
    return None


# ── Query classification ──────────────────────────────────────────────────────
# Maps user intent to (tool_function, category_for_kb_search).
# If tool is None → no retrieval needed, just let the LLM answer directly.

_INTENT_KEYWORDS: dict[str, tuple[str, str | None]] = {
    # (intent_key) → (tool: "kb" | "db", category_or_None)
}

# Keywords that indicate a database query (faculty/HOD/department)
_DB_KEYWORDS = [
    "faculty", "professor", "teacher", "staff", "lecturer",
    "hod", "head of department", "head of",
    "department", "departments",
]

# Keywords → knowledge base category mapping
_KB_CATEGORY_MAP = [
    (["admission", "admissions", "admit", "eligibility", "entrance", "apply", "application"], "admissions"),
    (["fee", "fees", "fee structure", "tuition", "cost", "payment", "scholarship"], "fees"),
    (["placement", "placements", "package", "salary", "recruit", "recruiter", "company", "companies", "placed"], "placements"),
    (["training", "training cell", "internship", "industrial"], "training_cell"),
    (["course", "courses", "program", "programmes", "programs", "b.tech", "btech", "m.tech", "mtech", "mba", "bba", "b.sc", "m.sc", "degree"], "courses"),
    (["syllabus", "curriculum", "subject", "subjects"], "syllabus"),
    (["hostel", "accommodation", "mess", "room", "residential", "dormitory"], "hostel"),
    (["lms", "learning management", "moodle", "online class"], "lms"),
    (["erp", "mis", "itmzone", "student portal"], "erp"),
    (["exam", "examination", "result", "marks", "grade", "grading", "cgpa", "sgpa"], "exam_updates"),
    (["event", "events", "fest", "festival", "cultural", "technical", "seminar", "workshop", "hackathon"], "events"),
    (["notice", "notices", "announcement", "circular", "notification"], "notices"),
    (["library", "books", "e-resources", "journal"], "library"),
    (["contact", "phone", "email", "address", "location", "direction", "map", "campus"], "contact_info"),
    (["timetable", "time table", "schedule", "class timing"], "timetable"),
    (["calendar", "academic calendar", "holiday", "vacation"], "academic_calendar"),
    (["innovation", "startup", "incubation", "ideapad", "innovation cell"], "innovation_cell"),
    (["research", "publication", "paper", "journal", "phd", "doctorate"], "general"),
    (["director", "principal", "dean", "official", "management", "leadership"], "general"),
]

# General chitchat patterns — no tool needed
_CHITCHAT_PATTERNS = [
    re.compile(r"^(who are you|what are you|what can you do|tell me about yourself)", re.IGNORECASE),
    re.compile(r"^(what is itm|tell me about itm|about itm|itm gwalior)", re.IGNORECASE),
    re.compile(r"^(help|help me)\s*$", re.IGNORECASE),
]


def _looks_like_person_name(message: str) -> bool:
    """Heuristic: does the message look like a "who is …" or a bare person name?"""
    msg = message.strip().rstrip("?.,!")
    lower = msg.lower()
    if lower.startswith(("who is", "who's", "tell me about dr", "tell me about prof", "tell me about mr", "tell me about mrs", "tell me about ms")):
        return True
    if re.match(r"^(dr\.?|prof\.?|mr\.?|mrs\.?|ms\.?)\s+[a-z]", lower):
        return True
    # Bare two-or-three-word capitalised name like "Shiv Kumar Sharma"
    words = msg.split()
    if 2 <= len(words) <= 4 and all(w[:1].isupper() and w.isalpha() for w in words):
        return True
    return False


def _classify_query(message: str) -> tuple[str, str | None]:
    """Classify user query into (tool_type, category).

    Returns:
        ("db", None)        → use query_database
        ("kb", category)    → use search_knowledge_base with category
        ("chat", None)      → no tool, direct LLM response
    """
    msg_lower = message.lower().strip()

    # Check if it's a chitchat / general question
    for pat in _CHITCHAT_PATTERNS:
        if pat.match(msg_lower):
            return ("chat", None)

    # Person-name queries → always try DB first (HODs & Faculty)
    if _looks_like_person_name(message):
        return ("db", None)

    # Check for database-related keywords (faculty/HOD/department)
    for kw in _DB_KEYWORDS:
        if kw in msg_lower:
            return ("db", None)

    # Check for knowledge base category keywords
    for keywords, category in _KB_CATEGORY_MAP:
        for kw in keywords:
            if kw in msg_lower:
                return ("kb", category)

    # Default: search knowledge base with "general" category
    return ("kb", "general")


# ── System prompt (for formatting LLM responses) ─────────────────────────────

SYSTEM_PROMPT = """You are the official AI Assistant of ITM Gwalior (Institute of Technology and Management, Gwalior).

You help students, parents, faculty, and visitors with information about admissions, academics, departments, HODs, faculty, placements, training, fees, research, hostel, campus life, events, and compliance.

**STAY ON THE QUESTION — STRICT:**
- Answer ONLY what the user explicitly asked. Do NOT volunteer adjacent or "while you're here" information.
- If the user asks about *eligibility / admission requirements*, answer with eligibility + how-to-apply + selection process. Do NOT mention department intake numbers, programme duration, faculty, or placement stats unless the user asked.
- If the user asks about *fees*, answer fees only. Do NOT include eligibility, intake, or location.
- If the user asks about *a person*, answer with that person's profile only. Do NOT list other faculty or departments.
- One topic per reply. No "general details" / "general information" appendix at the bottom.

**WHAT TO USE:**
- Use ONLY the "Retrieved Context" supplied below as the source of facts.
- The context comes from the official ITM Gwalior website + admin CMS.
- **Never** write a "Useful Pages", "Useful Links", "Related Links", "General Details", or similar section at the end — those links are rendered separately by the UI as clickable chips. End with the natural last sentence of your answer.

**RESPONSE RULES:**
- Reply in natural English, formatted in Markdown.
- Use short paragraphs, bullet lists, and bold for key data (names, numbers, dates).
- Each bullet point on its own line. No raw code, no JSON, no Python.
- Inline Markdown links are fine when the URL appears in the context (e.g., `[Apply Now](/admissions/how-to-apply)`).
- Keep replies focused and skimmable — aim for 6–12 lines.

**ANTI-HALLUCINATION:**
- If the retrieved context does NOT cover the question, say so politely in ONE sentence and recommend contacting the admission helpline (+91-7773005065 / admission@itmgoi.in). Do NOT fill the gap with unrelated context.
- Never fabricate names, fees, dates, intake numbers, or contact details.

You represent ITM Gwalior. Be warm, precise, and on-topic."""

ANSWER_PROMPT_TEMPLATE = """A user asked the following question about ITM Gwalior:

**User Question:** "{question}"

Here is the relevant data retrieved from the ITM Gwalior knowledge base:

---
{context}
---

Based ONLY on the above data, write a helpful, well-formatted Markdown response answering the user's question.
- Include relevant links if available.
- Use bullet points and headings for readability.
- Do NOT invent any information not present in the data above.
- If the data doesn't contain enough information, mention that and suggest visiting https://itm-gwalior.vercel.app"""

CHAT_PROMPT_TEMPLATE = """The user sent this message:

"{question}"

Respond helpfully as the ITM Gwalior AI Assistant. If it's a general question about ITM, answer based on your knowledge that ITM Gwalior (Institute of Technology and Management) is a premier educational institute in Gwalior, Madhya Pradesh, India.

For specific data questions, suggest the user ask about admissions, placements, faculty, courses, fees, hostel, events, etc."""


class AIAssistant:
    """Manages the NVIDIA LLM with manual RAG pipeline (no agent framework)."""

    def __init__(self):
        self._llm = None
        self._initialized = False
        self._use_http_fallback = False
        # Simple per-session conversation history (last N messages)
        self._history: dict[str, list[dict]] = defaultdict(list)
        self._max_history = 10

    async def initialize(self) -> None:
        """Initialize the LLM with fallback chain: ChatNVIDIA -> httpx direct."""
        if not settings.NVIDIA_API_KEY:
            logger.error("NVIDIA_API_KEY is not set — AI Assistant cannot start")
            return

        # ── Attempt 1: langchain ChatNVIDIA ──────────────────────────────
        try:
            from langchain_nvidia_ai_endpoints import ChatNVIDIA

            self._llm = ChatNVIDIA(
                model=settings.NVIDIA_MODEL,
                api_key=settings.NVIDIA_API_KEY,
                base_url=settings.NVIDIA_BASE_URL,
                temperature=settings.NVIDIA_TEMPERATURE,
                max_completion_tokens=settings.NVIDIA_MAX_TOKENS,
                top_p=settings.NVIDIA_TOP_P,
            )

            self._initialized = True
            self._use_http_fallback = False
            logger.info(
                "AI Assistant initialized (ChatNVIDIA)",
                extra={"model": settings.NVIDIA_MODEL},
            )
            return
        except TypeError:
            # Older langchain-nvidia-ai-endpoints may not accept max_completion_tokens
            logger.warning("ChatNVIDIA rejected max_completion_tokens, retrying with max_tokens")
            try:
                from langchain_nvidia_ai_endpoints import ChatNVIDIA

                self._llm = ChatNVIDIA(
                    model=settings.NVIDIA_MODEL,
                    api_key=settings.NVIDIA_API_KEY,
                    base_url=settings.NVIDIA_BASE_URL,
                    temperature=settings.NVIDIA_TEMPERATURE,
                    top_p=settings.NVIDIA_TOP_P,
                )

                self._initialized = True
                self._use_http_fallback = False
                logger.info(
                    "AI Assistant initialized (ChatNVIDIA, compat mode)",
                    extra={"model": settings.NVIDIA_MODEL},
                )
                return
            except Exception as e2:
                logger.warning("ChatNVIDIA init retry failed", exc_info=e2)
        except Exception as e:
            logger.warning("ChatNVIDIA init failed, will try httpx fallback", exc_info=e)

        # ── Attempt 2: direct httpx call to NVIDIA API ───────────────────
        try:
            import httpx

            test_url = f"{settings.NVIDIA_BASE_URL}/chat/completions"
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    test_url,
                    headers={
                        "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": settings.NVIDIA_MODEL,
                        "messages": [{"role": "user", "content": "ping"}],
                        "max_tokens": 5,
                    },
                )
                resp.raise_for_status()

            self._use_http_fallback = True
            self._initialized = True
            logger.info(
                "AI Assistant initialized (httpx fallback)",
                extra={"model": settings.NVIDIA_MODEL},
            )
        except Exception as e:
            logger.error("All LLM init attempts failed", exc_info=e)

    def _is_rate_limit_error(self, exc: BaseException) -> bool:
        """Check if an exception is a 429 rate limit error."""
        msg = str(exc).lower()
        return any(x in msg for x in ["429", "too many requests", "rate limit", "rate_limit"])

    def _append_links(self, answer: str, message: str, category: str | None) -> str:
        """Append the "Useful Pages" suggestion block to an answer, idempotently."""
        if not answer:
            return answer
        if "Useful Pages" in answer:
            return answer  # already appended by an earlier code path
        suffix = format_links_markdown(message, category=category)
        if not suffix:
            return answer
        return f"{answer.rstrip()}\n{suffix}"

    def _format_context_only(self, context: str, message: str) -> str:
        """When the LLM isn't available, return the raw retrieved context as Markdown.

        This keeps the bot useful even without an NVIDIA_API_KEY — visitors still
        see real information from the ITM knowledge base, and the page-suggestion
        footer added by the caller is wired in regardless.
        """
        if not context:
            return (
                "I couldn't find specific information for that in our records yet. "
                "Please contact the admissions helpline (+91-7773005065) or "
                "[get in touch](/contact)."
            )
        # Strip the "[Source: … | Relevance: …]" preamble each chunk carries.
        cleaned = re.sub(r"\[Source:[^\]]+\]\s*", "", context).strip()
        return (
            f"Here's what I found from the ITM Gwalior records about **{message.strip()}**:\n\n"
            f"{cleaned}"
        )

    def _add_to_history(self, session_id: str, role: str, content: str):
        """Add a message to session history."""
        history = self._history[session_id]
        history.append({"role": role, "content": content})
        # Keep only last N messages
        if len(history) > self._max_history:
            self._history[session_id] = history[-self._max_history:]

    def _get_history_context(self, session_id: str) -> str:
        """Get recent conversation history as context string."""
        history = self._history.get(session_id, [])
        if not history:
            return ""
        lines = []
        for msg in history[-6:]:  # Last 6 messages for context
            role = "User" if msg["role"] == "user" else "Assistant"
            lines.append(f"{role}: {msg['content'][:200]}")
        return "\n".join(lines)

    async def _retrieve_data(self, message: str) -> tuple[str, str]:
        """Retrieve relevant data using the appropriate tool.

        Returns:
            (tool_result, tool_used_description)
        """
        logger.info(f"\n{'='*50}\n[1] USER INPUT:\n{message}\n{'='*50}")
        tool_type, category = _classify_query(message)
        logger.info("Query classified", extra={"tool_type": tool_type, "category": category, "query": message[:80]})
        logger.info(f"\n{'='*50}\n[2] RAG SEARCHING:\nTool Type: {tool_type}, Category: {category}\n{'='*50}")

        if tool_type == "chat":
            return ("", "direct_chat")

        if tool_type == "db":
            try:
                result = await asyncio.to_thread(query_database.invoke, message)
                if result and "no matching data" not in result.lower():
                    return (result, f"query_database")
            except Exception as exc:
                logger.warning("query_database failed", exc_info=exc)

            # Fallback to knowledge base if DB didn't return results
            try:
                result = await asyncio.to_thread(
                    search_knowledge_base.invoke,
                    {"query": message, "category": "faculty"},
                )
                if result and "no indexed content" not in result.lower() and "not relevant" not in result.lower():
                    return (result, "search_knowledge_base(faculty)")
            except Exception as exc:
                logger.warning("KB fallback for DB query failed", exc_info=exc)

            return ("", "no_data")

        # tool_type == "kb"
        cat = category or "general"
        try:
            result = await asyncio.to_thread(
                search_knowledge_base.invoke,
                {"query": message, "category": cat},
            )
            if result and "no indexed content" not in result.lower() and "not relevant" not in result.lower():
                return (result, f"search_knowledge_base({cat})")
        except Exception as exc:
            logger.warning("search_knowledge_base failed", exc_info=exc)

        # Try with "general" if specific category failed
        if cat != "general":
            try:
                result = await asyncio.to_thread(
                    search_knowledge_base.invoke,
                    {"query": message, "category": "general"},
                )
                if result and "no indexed content" not in result.lower() and "not relevant" not in result.lower():
                    return (result, "search_knowledge_base(general)")
            except Exception as exc:
                logger.warning("KB general fallback failed", exc_info=exc)

        return ("", "no_data")

    def _build_user_prompt(self, question: str, context: str, session_id: str) -> str:
        """Build the user prompt with context and history."""
        if context:
            user_prompt = ANSWER_PROMPT_TEMPLATE.format(question=question, context=context)
        else:
            user_prompt = CHAT_PROMPT_TEMPLATE.format(question=question)

        history_ctx = self._get_history_context(session_id)
        if history_ctx:
            user_prompt = f"Recent conversation:\n{history_ctx}\n\n{user_prompt}"

        return user_prompt

    async def _http_generate(self, user_prompt: str) -> str:
        """Call NVIDIA API directly via httpx (non-streaming)."""
        import httpx as _httpx

        url = f"{settings.NVIDIA_BASE_URL}/chat/completions"
        payload = {
            "model": settings.NVIDIA_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": settings.NVIDIA_TEMPERATURE,
            "max_tokens": settings.NVIDIA_MAX_TOKENS,
            "top_p": settings.NVIDIA_TOP_P,
        }
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Content-Type": "application/json",
        }

        async for attempt in AsyncRetrying(
            retry=retry_if_exception(self._is_rate_limit_error),
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=2, min=2, max=30),
            reraise=True,
        ):
            with attempt:
                async with _httpx.AsyncClient(timeout=60) as client:
                    resp = await client.post(url, json=payload, headers=headers)
                    resp.raise_for_status()
                    data = resp.json()
                    return data["choices"][0]["message"]["content"].strip()

        return ""

    async def _http_stream(self, user_prompt: str) -> AsyncGenerator[str, None]:
        """Stream NVIDIA API response via httpx SSE."""
        import httpx as _httpx
        import json as _json

        url = f"{settings.NVIDIA_BASE_URL}/chat/completions"
        payload = {
            "model": settings.NVIDIA_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": settings.NVIDIA_TEMPERATURE,
            "max_tokens": settings.NVIDIA_MAX_TOKENS,
            "top_p": settings.NVIDIA_TOP_P,
            "stream": True,
        }
        headers = {
            "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
            "Content-Type": "application/json",
        }

        async with _httpx.AsyncClient(timeout=120) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    chunk_str = line[6:]
                    if chunk_str.strip() == "[DONE]":
                        break
                    try:
                        chunk = _json.loads(chunk_str)
                        delta = chunk["choices"][0].get("delta", {})
                        if delta.get("content"):
                            yield delta["content"]
                    except (KeyError, IndexError, _json.JSONDecodeError):
                        continue

    @staticmethod
    def _strip_trailing_links_block(answer: str) -> str:
        """Remove any "Useful Pages" / "Useful Links" trailer the LLM emits.

        The frontend renders page suggestions as coloured chips below the
        bubble, so we don't want the model duplicating the same list as
        Markdown text inside the body.
        """
        if not answer:
            return answer
        # Remove from the first occurrence of a "Useful Pages/Links" heading
        # to the end of the answer.
        marker = re.search(
            r"\n[-\s]*(?:\*\*|##)?\s*(?:🔗\s*)?\*?\*?Useful\s+(?:Pages|Links)\*?\*?",
            answer,
            re.IGNORECASE,
        )
        if marker:
            return answer[: marker.start()].rstrip()
        return answer

    async def _generate_answer(self, question: str, context: str, session_id: str) -> str:
        """Call the LLM to generate a natural language answer."""
        user_prompt = self._build_user_prompt(question, context, session_id)
        
        logger.info(f"\n{'='*50}\n[4] WHAT THE MODEL SEES (Final Prompt):\nSystem:\n{SYSTEM_PROMPT}\n\nUser:\n{user_prompt}\n{'='*50}")

        if self._use_http_fallback:
            answer = await self._http_generate(user_prompt)
        else:
            messages = [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=user_prompt),
            ]
            async for attempt in AsyncRetrying(
                retry=retry_if_exception(self._is_rate_limit_error),
                stop=stop_after_attempt(4),
                wait=wait_exponential(multiplier=2, min=2, max=30),
                reraise=True,
            ):
                with attempt:
                    response = await self._llm.ainvoke(messages)
            answer = response.content.strip() if response and response.content else ""

        if answer:
            answer = re.sub(r'(?<!\n)\s*([*-])\s', '\n\\1 ', answer)
            answer = self._strip_trailing_links_block(answer)
        return answer

    async def _stream_answer(self, question: str, context: str, session_id: str) -> AsyncGenerator[str, None]:
        """Stream the LLM answer token by token."""
        user_prompt = self._build_user_prompt(question, context, session_id)
        
        logger.info(f"\n{'='*50}\n[4] WHAT THE MODEL SEES (Final Prompt):\nSystem:\n{SYSTEM_PROMPT}\n\nUser:\n{user_prompt}\n{'='*50}")

        if self._use_http_fallback:
            async for token in self._http_stream(user_prompt):
                yield token
            return

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt),
        ]

        async for attempt in AsyncRetrying(
            retry=retry_if_exception(self._is_rate_limit_error),
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=2, min=2, max=30),
            reraise=True,
        ):
            with attempt:
                async for chunk in self._llm.astream(messages):
                    if chunk.content:
                        yield chunk.content
                break

    async def chat(self, message: str, session_id: str | None = None) -> dict[str, Any]:
        """Process a chat message and return the response."""
        start_time = time.time()
        sid = session_id or "default"

        # Greeting pre-check — respond without calling LLM (but still suggest links)
        greeting_key = _is_greeting(message)
        if greeting_key:
            answer = _GREETING_RESPONSES.get(greeting_key, _GREETING_RESPONSES["default"])
            return {
                "answer": answer,
                "sources": [
                    {"label": label, "path": path}
                    for label, path in suggest_links(message, "general")
                ],
                "processing_time_ms": int((time.time() - start_time) * 1000),
            }

        try:
            # Step 1: Retrieve relevant data
            context, tool_used = await self._retrieve_data(message)
            _tool_type, kb_category = _classify_query(message)
            logger.info("Data retrieved", extra={"tool": tool_used, "context_len": len(context)})
            logger.info(f"\n{'='*50}\n[3] RAG RESPONSE (Context):\n{context}\n{'='*50}")

            # No LLM? Serve the retrieved context directly so the chatbot is
            # still useful out of the box without an NVIDIA_API_KEY.
            if not self._initialized:
                fallback = self._format_context_only(context, message)
                fallback = self._append_links(fallback, message, category=kb_category)
                return {
                    "answer": fallback,
                    "sources": [
                        {"label": label, "path": path}
                        for label, path in suggest_links(message, kb_category)
                    ],
                    "processing_time_ms": int((time.time() - start_time) * 1000),
                }

            # Step 2: Generate answer using LLM
            answer = await self._generate_answer(message, context, sid)

            logger.info(f"\n{'='*50}\n[5] MODEL RESPONSE:\n{answer}\n{'='*50}")

            # Step 3: Fallback if LLM returned empty
            if not answer or not answer.strip():
                answer = (
                    "I couldn't find specific information for your question in our records. "
                    "Please reach out via the helpline (+91-7773005065) or "
                    "[contact us](/contact) for accurate details."
                )

            # Step 4: Suggestions are returned in `sources`, NOT inlined into
            # the answer — the frontend renders them as coloured chips below
            # the message bubble.

            processing_time = int((time.time() - start_time) * 1000)

            # Save to history
            self._add_to_history(sid, "user", message)
            self._add_to_history(sid, "assistant", answer)

            return {
                "answer": answer,
                "sources": [
                    {"label": label, "path": path}
                    for label, path in suggest_links(message, kb_category)
                ],
                "processing_time_ms": processing_time,
            }
        except Exception as e:
            logger.error("Chat error", exc_info=e)
            return {
                "answer": "I encountered an error processing your request. Please try again or contact ITM administration for assistance.",
                "sources": [],
                "processing_time_ms": int((time.time() - start_time) * 1000),
            }

    async def stream_chat(
        self, message: str, session_id: str | None = None
    ) -> AsyncGenerator[str, None]:
        """Stream a chat response token by token."""
        start_time = time.time()
        sid = session_id or "default"

        # Greeting pre-check
        greeting_key = _is_greeting(message)
        if greeting_key:
            answer = _GREETING_RESPONSES.get(greeting_key, _GREETING_RESPONSES["default"])
            yield answer
            return

        try:
            # Step 1: Retrieve relevant data (non-streaming)
            context, tool_used = await self._retrieve_data(message)
            _tool_type, kb_category = _classify_query(message)
            logger.info("Data retrieved for stream", extra={"tool": tool_used, "context_len": len(context)})
            logger.info(f"\n{'='*50}\n[3] RAG RESPONSE (Context):\n{context}\n{'='*50}")

            # No LLM? Stream the retrieved context so the chatbot is still
            # informative without an NVIDIA_API_KEY. Suggestions are surfaced
            # by the router as a separate SSE event, not inlined here.
            if not self._initialized:
                body = self._format_context_only(context, message)
                yield body
                self._add_to_history(sid, "user", message)
                self._add_to_history(sid, "assistant", body)
                return

            # Step 2: Stream the LLM answer.
            # Cut the stream the moment the model starts emitting a duplicate
            # "Useful Pages" trailer — those links are rendered as chips by
            # the frontend, so the body must stay clean.
            full_answer = ""
            trailer_re = re.compile(
                r"\n[-\s]*(?:\*\*|##)?\s*(?:🔗\s*)?\*?\*?Useful\s+(?:Pages|Links)\*?\*?",
                re.IGNORECASE,
            )
            stopped = False
            async for token in self._stream_answer(message, context, sid):
                if stopped:
                    continue
                full_answer += token
                marker = trailer_re.search(full_answer)
                if marker:
                    # Emit only the portion before the marker, then stop.
                    safe_tail = full_answer[: marker.start()]
                    delta = safe_tail[len(full_answer) - len(token) :]
                    if delta:
                        yield delta
                    full_answer = safe_tail
                    stopped = True
                    continue
                yield token

            logger.info(f"\n{'='*50}\n[5] MODEL RESPONSE:\n{full_answer}\n{'='*50}")

            # Fallback if nothing was generated
            if not full_answer.strip():
                fallback = (
                    "I couldn't find specific information for your question in our records. "
                    "Please reach out via the helpline (+91-7773005065) or "
                    "[contact us](/contact) for accurate details."
                )
                yield fallback
                full_answer = fallback

            # Step 3: Save to history.
            # Suggestions are emitted by the router as a separate SSE event,
            # so the LLM markdown body stays clean.
            self._add_to_history(sid, "user", message)
            self._add_to_history(sid, "assistant", full_answer)

        except Exception as e:
            logger.error("Stream chat error", exc_info=e)
            yield "\n\nI encountered an error. Please try again or contact ITM administration."

    def suggest_pages(self, message: str) -> list[dict[str, str]]:
        """Page links to surface alongside an answer, as `[{label, path}]`.

        Used by the chat router to emit a separate `suggestions` SSE event so
        the frontend can render them as coloured chips below the bubble
        instead of as plain Markdown inside the message body.
        """
        _tool_type, kb_category = _classify_query(message)
        return [
            {"label": label, "path": path}
            for label, path in suggest_links(message, kb_category)
        ]

    def get_suggestions(self) -> list[str]:
        """Return suggested questions for new users."""
        return [
            "What are the admission requirements for B.Tech?",
            "Show me the faculty list for CSE department",
            "What was the highest placement package last year?",
            "How do I access the LMS portal?",
            "What is the fee structure for MBA?",
            "Tell me about hostel facilities",
            "When are the upcoming events?",
            "What programs does ITM Gwalior offer?",
        ]

    @property
    def is_initialized(self) -> bool:
        return self._initialized


# Singleton instance
assistant = AIAssistant()
