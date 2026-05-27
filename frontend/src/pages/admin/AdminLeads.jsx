import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Inbox, Trash2, X } from 'lucide-react';
import { admissionsApi, formsApi, careersApi } from '../../api/admissions';
import { errorMessage } from '../../api/client';

const TABS = [
  { key: 'leads', label: 'Admission Leads' },
  { key: 'contact', label: 'Contact Inbox' },
  { key: 'grievance', label: 'Grievance Inbox' },
  { key: 'applications', label: 'Job Applications' },
];

const STATUS_OPTIONS_LEAD = ['new', 'contacted', 'qualified', 'enrolled', 'rejected', 'spam'];
const STATUS_OPTIONS_FORM = ['new', 'in_progress', 'resolved', 'spam'];
const STATUS_OPTIONS_APP  = ['new', 'shortlisted', 'interviewing', 'rejected', 'hired'];

function Detail({ item, onClose, onStatus }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || '');
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Detail</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm space-y-2">
          {Object.entries(item).filter(([k]) => !['created_at', 'id', 'status'].includes(k)).map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">{k.replace(/_/g, ' ')}</div>
              <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {v == null ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <label className="block text-xs">
            <span className="block font-bold text-gray-500 mb-1">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800">
              {onStatus.options.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          {onStatus.includeNotes && (
            <label className="block text-xs">
              <span className="block font-bold text-gray-500 mb-1">Notes</span>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800" />
            </label>
          )}
          <button
            onClick={() => onStatus.fn({ status, notes })}
            className="bg-[#800000] text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
          >Save</button>
        </div>
      </div>
    </div>
  );
}

function TableTab({ items, columns, isLoading, onOpen, onRemove }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
          <tr>
            {columns.map((c) => <th key={c} className="text-left px-3 py-2">{c}</th>)}
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading && <tr><td colSpan={columns.length + 1} className="text-center py-6 text-gray-400 text-xs">Loading…</td></tr>}
          {!isLoading && items.length === 0 && <tr><td colSpan={columns.length + 1} className="text-center py-6 text-gray-400 text-xs">Inbox empty.</td></tr>}
          {items.map((it) => (
            <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer" onClick={() => onOpen(it)}>
              {columns.map((c) => {
                const k = c.toLowerCase().replace(/ /g, '_');
                return (
                  <td key={c} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300 truncate max-w-[20ch]">
                    {String(it[k] ?? '')}
                  </td>
                );
              })}
              <td className="px-3 py-2 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                {onRemove && (
                  <button onClick={() => onRemove(it)} className="text-xs text-gray-400 hover:text-red-600">
                    <Trash2 size={12} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminLeads() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('leads');
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState('');

  const leadsQ = useQuery({
    queryKey: ['admin-leads', tab],
    queryFn: () => {
      if (tab === 'leads') return admissionsApi.listLeads();
      if (tab === 'contact') return formsApi.list({ kind: 'general' });
      if (tab === 'grievance') return formsApi.list({ kind: 'grievance' });
      if (tab === 'applications') return careersApi.listApplications();
      return Promise.resolve([]);
    },
  });

  const reload = () => qc.invalidateQueries({ queryKey: ['admin-leads'] });

  const onStatus = (item) => {
    if (tab === 'leads') {
      return {
        options: STATUS_OPTIONS_LEAD,
        includeNotes: false,
        fn: async ({ status }) => {
          try { await admissionsApi.updateLead(item.id, { status }); setDetail(null); reload(); }
          catch (e) { setErr(errorMessage(e)); }
        },
      };
    }
    if (tab === 'applications') {
      return {
        options: STATUS_OPTIONS_APP,
        includeNotes: true,
        fn: async ({ status, notes }) => {
          try { await careersApi.updateApplication(item.id, { status, notes }); setDetail(null); reload(); }
          catch (e) { setErr(errorMessage(e)); }
        },
      };
    }
    return {
      options: STATUS_OPTIONS_FORM,
      includeNotes: false,
      fn: async ({ status }) => {
        try { await formsApi.update(item.id, { status }); setDetail(null); reload(); }
        catch (e) { setErr(errorMessage(e)); }
      },
    };
  };

  const removeLead = async (it) => {
    if (!confirm('Delete this lead?')) return;
    try { await admissionsApi.deleteLead(it.id); reload(); }
    catch (e) { setErr(errorMessage(e)); }
  };

  const items = leadsQ.data || [];
  const columns = (
    tab === 'leads' ? ['name', 'email', 'phone', 'programme_interest', 'city', 'status'] :
    tab === 'applications' ? ['applicant_name', 'email', 'phone', 'position_id', 'status'] :
                            ['name', 'email', 'subject', 'kind', 'status']
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Inbox size={20} /> Inbox
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Scoped: <code className="font-mono">admissions.leads</code> · <code className="font-mono">forms.contact</code> · <code className="font-mono">forms.grievance</code> · <code className="font-mono">careers.applications</code>
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded ${tab === t.key ? 'bg-[#800000] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}
            >
              {t.label} <span className="ml-1 text-[9px] bg-white/30 px-1 rounded">{items.length}</span>
            </button>
          ))}
        </div>

        {err && <div className="text-xs text-red-600 mb-2">{err}</div>}

        <TableTab
          items={items}
          columns={columns.map((c) => c.replace(/_/g, ' '))}
          isLoading={leadsQ.isLoading}
          onOpen={(it) => setDetail(it)}
          onRemove={tab === 'leads' ? removeLead : undefined}
        />

        {detail && <Detail item={detail} onClose={() => setDetail(null)} onStatus={onStatus(detail)} />}
      </div>
    </div>
  );
}
