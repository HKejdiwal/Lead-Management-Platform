import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'Admin' | 'Sales' };
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Authorization token missing');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as { id: string; role: 'Admin' | 'Sales' };
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid token');
  }

  req.user = { id: user._id.toString(), role: user.role };
  next();
});

export const authorizeRole = (role: 'Admin' | 'Sales') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      res.status(403);
      throw new Error('Forbidden');
    }
    next();
  };
};
