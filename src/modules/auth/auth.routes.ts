import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { registerSchema, loginSchema } from './auth.schemas.js';
import * as controller from './auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(controller.register));
router.post('/login', validate(loginSchema), asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));

export const authRouter = router;
