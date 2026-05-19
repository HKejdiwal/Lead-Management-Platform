import { ILead } from '../models/Lead';

export function createCsv(leads: Array<ILead & { _id: any }>) {
  const header = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, lead.createdAt.toISOString()]);
  const csv = [header.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
  return csv;
}
