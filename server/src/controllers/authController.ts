import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

function generateToken(user: IUser) {
  return jwt.sign({ id: (user as any)._id, role: user.role }, process.env.JWT_SECRET ?? 'secret', {
    expiresIn: '12h',
  });
}

export const registerUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;
  const assignedRole = isFirstUser
    ? 'Admin'
    : req.user?.role === 'Admin' && role === 'Admin'
    ? 'Admin'
    : 'Sales';

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: assignedRole,
  });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user),
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user),
  });
});
