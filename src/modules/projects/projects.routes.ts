import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate, validateQuery } from '../../middlewares/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
} from './projects.schemas.js';
import * as controller from './projects.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), asyncHandler(controller.create));
router.get('/', validateQuery(listProjectsQuerySchema), asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', validate(updateProjectSchema), asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

export const projectsRouter = router;
