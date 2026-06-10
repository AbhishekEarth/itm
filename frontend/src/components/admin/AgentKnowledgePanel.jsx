/**
 * Admin-dashboard widget — one-click re-sync of the chatbot's knowledge base.
 *
 * The AI agent answers questions from a vector index (ChromaDB) seeded from
 * the live API + static ITM data. When the admin edits department info, HoDs,
 * placements, etc., the vector index doesn't auto-refresh — visitors keep
 * seeing stale facts in the chatbot. This panel exposes a single
 * "Refresh Now" button that:
 *
 *   1. POST /api/ai/manage/reindex       — clears the ChromaDB collection.
 *   2. POST /api/ai/manage/index-all     — re-indexes static data + API data
 *                                          (departments, recruiters, research,
 *                                           events, notices, compliance, …).
 *
 * The widget also surfaces health stats (model, connection state, total docs)
 * so the admin can confirm the agent is up before/after the refresh.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Bot,
  Database, Zap,
} from 'lucide-react';
import { aiAgentAPI } from '../../api/ai-agent';

export default function AgentKnowledgePanel() {
  const [health, setHealth] = useState(null);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(''); // 'clearing' | 'indexing' | ''
  const [result, setResult] = useState(null); // { ok, chunks, errors } | null
  const [err, setErr] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(() => {
    try { return localStorage.getItem('itm_agent_last_sync') || null; } catch { return null; }
  });

  const loadHealth = useCallback(async () => {
    try {
      const data = await aiAgentAPI.healthCheck();
      setHealth(data);
    } catch (e) {
      setHealth({ status: 'unavailable' });
    }
  }, []);

  useEffect(() => { loadHealth(); }, [loadHealth]);

  const refresh = async () => {
    if (busy) return;
    setBusy(true);
    setErr(''); setResult(null);
    try {
      setPhase('clearing');
      await aiAgentAPI.reindex();
      setPhase('indexing');
      const r = await aiAgentAPI.indexAll();
      const now = new Date().toISOString();
      setLastSyncedAt(now);
      try { localStorage.setItem('itm_agent_last_sync', now); } catch {}
      setResult({ ok: true, chunks: r?.total_chunks_indexed ?? 0, errors: r?.errors || [] });
      await loadHealth();
    } catch (e) {
      setErr(e?.message || 'Refresh failed');
      setResult({ ok: false });
    } finally {
      setBusy(false);
      setPhase('');
    }
  };

  const ok = health?.status === 'ok';
  const docs = health?.documents_indexed;
  const formattedSync = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString()
    : 'Never';

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-gray-800 shadow-sm p-5 sm:p-6">
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-rose-400 to-[#800000] opacity-10 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-[#800000] flex items-center justify-center shadow-md">
          <Bot size={24} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> AI Agent Knowledge
            </h3>
            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
              ok
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              {ok ? <CheckCircle2 size={9} /> : <AlertTriangle size={9} />}
              {health?.status || '…'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            After editing any content on the website, click <strong>Refresh Now</strong> so the chatbot re-reads the latest data and stops answering with stale information.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2.5 py-2">
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                <Database size={9} /> Indexed
              </div>
              <div className="text-base font-black text-gray-900 dark:text-white">
                {docs ?? '—'}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2.5 py-2">
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                <Zap size={9} /> Model
              </div>
              <div className="text-[11px] font-black text-gray-900 dark:text-white truncate" title={health?.model || ''}>
                {(health?.model || '—').split('/').slice(-1)[0]}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2.5 py-2">
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">Last sync</div>
              <div className="text-[11px] font-black text-gray-900 dark:text-white truncate" title={formattedSync}>
                {lastSyncedAt
                  ? new Date(lastSyncedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Never'}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-stretch gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-[#800000] text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            {busy
              ? phase === 'clearing'
                ? 'Clearing…'
                : 'Re-indexing…'
              : 'Refresh Now'}
          </button>
          {busy && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center max-w-[180px]">
              ~10–60 sec depending on data size. Don't close the tab.
            </p>
          )}
        </div>
      </div>

      {/* Feedback row */}
      {result?.ok && !busy && (
        <div className="mt-4 flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg">
          <CheckCircle2 size={14} />
          <span className="font-black">Knowledge refreshed.</span>
          <span>
            Indexed <strong>{result.chunks}</strong> chunks{result.errors?.length ? ` · ${result.errors.length} non-fatal warnings` : ''}.
          </span>
        </div>
      )}
      {err && (
        <div className="mt-4 flex items-center gap-2 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg">
          <AlertTriangle size={14} />
          <span><strong>Refresh failed.</strong> {err}</span>
        </div>
      )}
    </div>
  );
}
