import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Lead from '../models/Lead';
import { createCsv } from '../utils/csv';

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort = 'latest', page = '1' } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limit = 10;
  const skip = (pageNumber - 1) * limit;

  const filters: Record<string, unknown> = {};
  if (status) filters.status = status;
  if (source) filters.source = source;
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const total = await Lead.countDocuments(filters);
  const leads = await Lead.find(filters).sort(sortOrder).skip(skip).limit(limit);

  res.json({
    data: leads,
    meta: {
      total,
      page: pageNumber,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  res.json({ data: lead });
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, status, source } = req.body;
  const lead = await Lead.create({ name, email, status, source });
  res.status(201).json({ data: lead });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  res.json({ data: updated });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  await lead.deleteOne();
  res.json({ message: 'Lead deleted successfully' });
});

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort = 'latest' } = req.query;
  const filters: Record<string, unknown> = {};
  if (status) filters.status = status;
  if (source) filters.source = source;
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const leads = await Lead.find(filters).sort(sortOrder);
  const csv = createCsv(leads);

  res.header('Content-Type', 'text/csv');
  res.attachment('leads-export.csv');
  res.send(csv);
});
