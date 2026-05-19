import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sales';
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Sales'], default: 'Sales' },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>('User', userSchema);
