import { body } from 'express-validator';

const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources = ['Website', 'Instagram', 'Referral'];

export const validateCreateLead = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('source').isIn(sources).withMessage('Source is required'),
  body('status').optional().isIn(statuses).withMessage('Invalid status'),
];

export const validateUpdateLead = [
  body('name').optional().trim().notEmpty().withMessage('Lead name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('source').optional().isIn(sources).withMessage('Invalid source'),
  body('status').optional().isIn(statuses).withMessage('Invalid status'),
];
