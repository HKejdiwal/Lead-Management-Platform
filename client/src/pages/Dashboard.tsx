import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Lead, LeadsResponse } from '../types/api';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Lost'] as const;
const sourceOptions = ['All', 'Website', 'Instagram', 'Referral'] as const;
const sortOptions = ['latest', 'oldest'] as const;

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState<'Website' | 'Instagram' | 'Referral'>('Website');
  const [newStatus, setNewStatus] = useState<'New' | 'Contacted' | 'Qualified' | 'Lost'>('New');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 450);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status !== 'All') params.append('status', status);
    if (source !== 'All') params.append('source', source);
    if (debouncedSearch) params.append('search', debouncedSearch);
    params.append('sort', sort);
    params.append('page', page.toString());
    return params.toString();
  }, [status, source, debouncedSearch, sort, page]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get<LeadsResponse>(`/leads?${query}`)
      .then((response) => {
        setLeads(response.data.data);
        setMeta(response.data.meta);
      })
      .catch(() => setError('Unable to load leads.'))
      .finally(() => setLoading(false));
  }, [query]);

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', {
        params: { status: status !== 'All' ? status : undefined, source: source !== 'All' ? source : undefined, search: debouncedSearch, sort },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const responseStatus = (error as any)?.response?.status;
      if (responseStatus === 403) {
        setError('Export denied: admin access is required.');
      } else {
        setError('Export failed. Please try again.');
      }
    }
  };

  const handleCreateLead = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/leads', {
        name: newName,
        email: newEmail,
        status: newStatus,
        source: newSource,
      });
      setNewName('');
      setNewEmail('');
      setNewSource('Website');
      setNewStatus('New');
      setPage(1);
    } catch {
      setError('Unable to create lead.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    setDeletingId(id);
    setError('');

    try {
      await api.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      setMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
    } catch (err) {
      const responseStatus = (err as any)?.response?.status;
      if (responseStatus === 403) {
        setError('Delete denied: admin access is required.');
      } else {
        setError('Unable to delete lead.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleScrollToCreate = () => {
    document.getElementById('create-lead')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-600">Manage leads with filters, search, sorting, and pagination.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button onClick={handleExport} className="rounded-2xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700">
            Export CSV
          </button>
          <button onClick={handleScrollToCreate} className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-700 hover:bg-slate-200">
            New Lead
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-3 sm:grid-cols-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {statusOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {sourceOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as 'latest' | 'oldest')} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {sortOptions.map((item) => (
                  <option key={item} value={item}>{item === 'latest' ? 'Latest' : 'Oldest'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
            <label className="block text-sm font-medium text-slate-700">
              Search by name or email
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search leads..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
              />
            </label>
          </div>

          <div id="create-lead" className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Create New Lead</h2>
            <form className="mt-4 space-y-4" onSubmit={handleCreateLead}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Lead name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                required
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Lead email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
                <select value={newSource} onChange={(e) => setNewSource(e.target.value as any)} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <button type="submit" disabled={saving} className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? 'Saving...' : 'Create Lead'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-slate-200">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p className="text-rose-600">{error}</p>
            ) : leads.length === 0 ? (
              <p className="text-slate-600">No leads match the selected filters.</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead._id} className="rounded-3xl border border-slate-200 p-4 hover:border-sky-500">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-slate-900">{lead.name}</h2>
                        <p className="text-sm text-slate-600">{lead.email}</p>
                        <p className="mt-2 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{lead.source}</p>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/leads/${lead._id}`)}
                          className="rounded-2xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                        >
                          Edit
                        </button>
                        {user?.role === 'Admin' ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead._id)}
                            disabled={deletingId === lead._id}
                            className="rounded-2xl bg-rose-100 px-4 py-2 text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === lead._id ? 'Deleting...' : 'Delete'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{lead.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Pagination meta={meta} page={page} onPageChange={setPage} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
