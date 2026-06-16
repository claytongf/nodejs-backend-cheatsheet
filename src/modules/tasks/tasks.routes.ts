import { Router } from 'express';
import * as controller from './tasks.controller.js';

const router = Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', controller.update);
router.patch('/:id/complete', controller.complete);
router.delete('/:id', controller.remove);

export const tasksRouter = router;
