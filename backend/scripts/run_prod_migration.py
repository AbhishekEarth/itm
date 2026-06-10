"""Run Alembic against the production Supabase DB using .env.production values.

Usage:
    python -m scripts.run_prod_migration current        # show current head
    python -m scripts.run_prod_migration upgrade head    # apply pending migrations
    python -m scripts.run_prod_migration history --rev-range -3:    # inspect last 3
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import dotenv_values

BACKEND_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = BACKEND_ROOT / ".env.production"

if not ENV_PATH.exists():
    sys.exit(f"missing env file: {ENV_PATH}")

env = dotenv_values(ENV_PATH)
required = ["DATABASE_URL"]
missing = [k for k in required if not env.get(k)]
if missing:
    sys.exit(f"env missing keys: {missing}")

# Pre-populate os.environ before importing alembic / settings so pydantic-settings
# picks up the production DATABASE_URL instead of the local .env one.
for k, v in env.items():
    if v is not None:
        os.environ.setdefault(k, v)

# Quick visibility (host only, not credentials) before running.
db_host = env["DATABASE_URL"].split("@")[-1].split("/")[0]
print(f"[migrate] target DB host: {db_host}")

# Make sure cwd is the backend dir so alembic.ini is discoverable.
os.chdir(BACKEND_ROOT)
sys.path.insert(0, str(BACKEND_ROOT))

from alembic.config import main as alembic_main  # noqa: E402

alembic_main(argv=sys.argv[1:])
