import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Lead } from '../types/api';
import Spinner from '../components/Spinner';

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'New' | 'Contacted' | 'Qualified' | 'Lost'>('New');
  const [source, setSource] = useState<'Website' | 'Instagram' | 'Referral'>('Website');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<{ data: Lead }>(`/leads/${id}`)
      .then((response) => {
        setLead(response.data.data);
        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setStatus(response.data.data.status);
        setSource(response.data.data.source);
      })
      .catch((error) => {
        const status = (error as any)?.response?.status;
        if (status === 401) {
          setError('Authorization required. Please login again.');
        } else if (status === 403) {
          setError('Access denied.');
        } else {
          setError('Unable to load lead details.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      const response = await api.put<{ data: Lead }>(`/leads/${id}`, { name, email, status, source });
      setLead(response.data.data);
    } catch {
      setError('Unable to update the lead.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this lead permanently?')) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`/leads/${id}`);
      navigate('/');
    } catch {
      setError('Unable to delete the lead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-700 hover:bg-slate-200">
        Back
      </button>
      <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="text-rose-600">{error}</p>
        ) : lead ? (
          <form className="space-y-6" onSubmit={handleUpdate}>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Lead</h1>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Source</label>
                <select value={source} onChange={(e) => setSource(e.target.value as any)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={saving} className="rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {saving ? 'Saving...' : 'Update Lead'}
              </button>
              {user?.role === 'Admin' ? (
                <button type="button" onClick={handleDelete} disabled={saving} className="rounded-2xl bg-rose-100 px-5 py-3 text-rose-700 hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50">
                  Delete Lead
                </button>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="text-slate-600">Lead not found.</p>
        )}
      </div>
    </div>
  );
}

export default LeadDetails;
