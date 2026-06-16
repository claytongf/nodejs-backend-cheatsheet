import { Router } from 'express';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { updateUserSchema } from './users.schemas.js';
import * as controller from './users.controller.js';

const router = Router();

// Every users route requires authentication.
router.use(authenticate);

router.get('/', requireRole('ADMIN'), asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', validate(updateUserSchema), asyncHandler(controller.update));
router.delete('/:id', requireRole('ADMIN'), asyncHandler(controller.remove));

export const usersRouter = router;
