import { Schema, model } from 'mongoose';

export interface ILead {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: Date;
}

const leadSchema = new Schema<ILead>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ILead>('Lead', leadSchema);
