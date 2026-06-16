# Cheatsheet · Express

## App & router

```ts
import express, { Router } from 'express';
const app = express();
app.use(express.json());           // parse JSON bodies

const router = Router();
router.get('/', handler);
app.use('/tasks', router);         // mount under /tasks
```

## Route handlers

| Method | Example |
| --- | --- |
| GET | `router.get('/:id', getOne)` |
| POST | `router.post('/', create)` |
| PATCH | `router.patch('/:id', update)` |
| DELETE | `router.delete('/:id', remove)` |

## Request data

| Source | Access |
| --- | --- |
| Body | `req.body` (needs `express.json()`) |
| Route param | `req.params.id` |
| Query string | `req.query.page` |
| Header | `req.headers.authorization` |

## Response helpers

```ts
res.status(201).json(data);   // status + JSON
res.status(204).end();        // no content
res.json({ ok: true });       // 200 + JSON
```

## Middleware

```ts
// Normal middleware (3 args)
const log = (req, _res, next) => { console.log(req.url); next(); };

// Error middleware (4 args) — register LAST
const onError = (err, _req, res, _next) => res.status(500).json({ message: 'Error' });

app.use(log);
app.use('/tasks', taskRouter);
app.use(notFound);   // 404 fallback
app.use(onError);    // error handler last
```

## Async handler pattern

```ts
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => { /* ... */ }));
```

## Order rules

1. Body/log middleware first
2. Routers
3. `notFound` (404)
4. error middleware (4 args) — **always last**
