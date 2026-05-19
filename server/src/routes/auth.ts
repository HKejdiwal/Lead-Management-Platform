import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateRegister, validateLogin } from '../validators/auth';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

router.post('/register', validateRegister, validateRequest, registerUser);
router.post('/login', validateLogin, validateRequest, loginUser);

export default router;
