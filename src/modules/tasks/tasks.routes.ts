import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';
import * as controller from './tasks.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/', validate(createTaskSchema), controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateTaskSchema), controller.update);
router.patch('/:id/complete', controller.complete);
router.delete('/:id', controller.remove);

export const tasksRouter = router;
