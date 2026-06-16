# 03 · HTTP & REST APIs

## What it is

**HTTP** is the request/response protocol of the web. A client sends a request (method +
path + headers + optional body); the server returns a response (status code + headers +
body). **REST** is a style for designing HTTP APIs around **resources** (nouns) acted on
by HTTP **methods** (verbs).

## Why it matters in backend development

Almost every backend job is, at its core, building HTTP APIs. If you understand methods,
status codes, headers, and idempotency, you can design predictable APIs and debug them
with the browser dev tools or `curl`.

## Key concepts

| Concept     | Meaning                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| Method      | `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (remove)           |
| Status code | `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error            |
| Headers     | Metadata (`Content-Type`, `Authorization`, ...)                                  |
| Body        | The payload (usually JSON)                                                       |
| Idempotency | Same request, same effect (`GET`, `PUT`, `DELETE` are idempotent; `POST` is not) |

Common status codes: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`,
`401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable
Entity`, `500 Internal Server Error`.

## How it appears in real Node.js jobs

You will design routes like `POST /projects` and `GET /projects/:id`, choose correct
status codes, set `Authorization: Bearer <token>` headers, and explain why a `DELETE`
returns `204`. Reviewers will reject a `200` where a `201` belongs.

## Simple code example

```ts
import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not Found' }));
});

server.listen(3000);
```

## Practical example from this project

The API's endpoint table (see the README) is a REST design: plural resource nouns
(`/tasks`), HTTP verbs for actions, `201` on create, `204` on delete, and a special
sub-action `PATCH /tasks/:id/complete`. Routes are declared in each module's
`*.routes.ts`.

## Laravel comparison

Laravel's `Route::apiResource('tasks', TaskController::class)` generates the same REST
endpoints. In Node/Express you wire them explicitly with a `Router`, which is more verbose
but more transparent. Status codes and methods are identical concepts.

## Common beginner mistakes

- Returning `200` for everything (including errors).
- Using verbs in paths (`/getTasks`) instead of nouns + methods.
- Putting sensitive data in the URL/query string instead of the body or headers.
- Forgetting `Content-Type: application/json`.

## Best practices

- Use nouns for resources, verbs as HTTP methods.
- Return the **right** status code; reserve `5xx` for actual server faults.
- Keep responses consistent (same error shape everywhere — see chapter 08).
- Version your API (`/v1/...`) when it is public and likely to change.

## Study checklist

- [ ] I can list the main HTTP methods and when to use them.
- [ ] I know the meaning of `201`, `204`, `400`, `401`, `403`, `404`, `422`, `500`.
- [ ] I understand idempotency.
- [ ] I can design RESTful routes for a resource.

## Interview questions

**Q: Difference between `PUT` and `PATCH`?**
A: `PUT` replaces the whole resource; `PATCH` applies a partial update. This project uses
`PATCH` for updates.

**Q: `401` vs `403`?**
A: `401 Unauthorized` means "not authenticated" (no/invalid credentials); `403 Forbidden`
means "authenticated but not allowed."

**Q: Why return `204` on delete?**
A: The action succeeded and there is no content to return, so `204 No Content` is the
precise code.
