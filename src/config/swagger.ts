// OpenAPI specification for the Task Manager API, served at /api-docs.
// We assemble the spec with swagger-jsdoc from a single definition object (kept
// here, next to the rest of the config) so it works the same in dev and prod.
import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Node.js Backend Cheatsheet — Task Manager API',
    version: '0.1.0',
    description:
      'A practical, well-documented Task Manager API built with TypeScript, Express, ' +
      'Prisma and PostgreSQL. Authentication uses JWT; authorization combines roles ' +
      '(USER/ADMIN) with ownership checks.',
    license: { name: 'MIT' },
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: 'Local development server' }],
  tags: [
    { name: 'Auth', description: 'Registration, login, and the current user' },
    { name: 'Users', description: 'User management (some endpoints are admin-only)' },
    { name: 'Projects', description: 'Projects owned by the authenticated user' },
    { name: 'Tasks', description: 'Tasks that belong to a project you own' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Not Found' } },
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
            example: { title: ['String must contain at least 2 character(s)'] },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Demo User' },
          email: { type: 'string', format: 'email', example: 'user@demo.test' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, example: 'Ada Lovelace' },
          email: { type: 'string', format: 'email', example: 'ada@example.com' },
          password: { type: 'string', minLength: 8, example: 'password123' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@demo.test' },
          password: { type: 'string', example: 'password123' },
        },
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, example: 'New Name' },
          email: { type: 'string', format: 'email', example: 'new@example.com' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'My Project' },
          description: { type: 'string', nullable: true, example: 'Optional description' },
          ownerId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProjectInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2, example: 'My Project' },
          description: { type: 'string', example: 'What this project is about' },
        },
      },
      UpdateProjectInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, example: 'Renamed Project' },
          description: { type: 'string', nullable: true, example: 'Updated description' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Write the docs' },
          description: { type: 'string', nullable: true, example: 'Optional details' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'TODO' },
          projectId: { type: 'string', format: 'uuid' },
          ownerId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateTaskInput: {
        type: 'object',
        required: ['title', 'projectId'],
        properties: {
          title: { type: 'string', minLength: 2, example: 'Write the docs' },
          description: { type: 'string', example: 'Optional details' },
          projectId: { type: 'string', format: 'uuid' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'TODO' },
        },
      },
      UpdateTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 2, example: 'Updated title' },
          description: { type: 'string', nullable: true, example: 'Updated details' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'], example: 'IN_PROGRESS' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid authentication token',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Missing authentication token' },
          },
        },
      },
      Forbidden: {
        description: 'Authenticated, but not allowed to perform this action',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Forbidden' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { message: 'Task not found' },
          },
        },
      },
      ValidationFailed: {
        description: 'Request body failed validation',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check',
        security: [],
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                example: { status: 'ok', uptime: 123.45 },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
            },
          },
          409: {
            description: 'Email already registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Email already registered' },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in and receive a JWT',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Invalid credentials' },
              },
            },
          },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current authenticated user',
        responses: {
          200: {
            description: 'The current user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users (admin only)',
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/users/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Users'],
        summary: 'Get a user by id',
        responses: {
          200: {
            description: 'The user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a user (self or admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateUserInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated user',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user (admin only)',
        responses: {
          204: { description: 'User deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/projects': {
      get: {
        tags: ['Projects'],
        summary: 'List your projects (admin sees all)',
        responses: {
          200: {
            description: 'List of projects',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Create a project',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateProjectInput' } },
          },
        },
        responses: {
          201: {
            description: 'Project created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
    },
    '/projects/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Projects'],
        summary: 'Get a project (owner or admin)',
        responses: {
          200: {
            description: 'The project',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Projects'],
        summary: 'Update a project (owner or admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateProjectInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated project',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete a project (owner or admin)',
        responses: {
          204: { description: 'Project deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List your tasks (admin sees all)',
        responses: {
          200: {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a task in a project you own',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateTaskInput' } },
          },
        },
        responses: {
          201: {
            description: 'Task created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
    },
    '/tasks/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Tasks'],
        summary: 'Get a task (owner or admin)',
        responses: {
          200: {
            description: 'The task',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Tasks'],
        summary: 'Update a task (owner or admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateTaskInput' } },
          },
        },
        responses: {
          200: {
            description: 'Updated task',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          422: { $ref: '#/components/responses/ValidationFailed' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task (owner or admin)',
        responses: {
          204: { description: 'Task deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/tasks/{id}/complete': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      patch: {
        tags: ['Tasks'],
        summary: 'Mark a task complete (owner or admin)',
        responses: {
          200: {
            description: 'Task marked as DONE',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Task' },
                example: {
                  id: '8e6959c7-6fb0-4ee8-b2cf-243110dd706b',
                  title: 'Write the docs',
                  description: null,
                  status: 'DONE',
                  projectId: '862cbaed-1111-2222-3333-444455556666',
                  ownerId: '5177868b-07e0-47f8-8122-4b084ea138f0',
                  createdAt: '2026-06-16T12:45:44.398Z',
                  updatedAt: '2026-06-16T12:46:10.000Z',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};

export const openapiSpec = swaggerJSDoc({ definition, apis: [] });
