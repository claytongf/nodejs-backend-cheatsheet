import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';
import * as controller from './tasks.controller.js';

const router = Router();

router.get('/', asyncHandler(controller.list));
router.post('/', validate(createTaskSchema), asyncHandler(controller.create));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', validate(updateTaskSchema), asyncHandler(controller.update));
router.patch('/:id/complete', asyncHandler(controller.complete));
router.delete('/:id', asyncHandler(controller.remove));

export const tasksRouter = router;
