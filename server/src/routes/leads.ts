import express from 'express';
import {
  createLead,
  deleteLead,
  exportLeads,
  getLead,
  getLeads,
  updateLead,
} from '../controllers/leadController';
import { protect, authorizeRole } from '../middleware/auth';
import { validateCreateLead, validateUpdateLead } from '../validators/lead';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.use(protect);
router.get('/', getLeads);
router.get('/export', authorizeRole('Admin'), exportLeads);
router.get('/:id', getLead);
router.post('/', validateCreateLead, validateRequest, createLead);
router.put('/:id', validateUpdateLead, validateRequest, updateLead);
router.delete('/:id', authorizeRole('Admin'), deleteLead);

export default router;
