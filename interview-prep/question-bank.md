# Question Bank

Questions are grouped by topic and level. A strong answer should be clear, concrete, and
connected to real project files.

## Node.js Runtime

### Junior

**Q: Is Node.js single-threaded?**
A: JavaScript runs on one main thread, while libuv and the operating system handle many
I/O operations concurrently.

Strong answer signals:

- Mentions the event loop.
- Distinguishes JavaScript execution from I/O handling.
- Explains why blocking CPU work hurts all requests.

### Mid-Level

**Q: What happens when an Express route awaits a database query?**
A: The request handler yields while the database work is pending. Node can continue
processing other events, then resumes the handler when the promise resolves.

Strong answer signals:

- Explains `await` without saying it blocks the whole process.
- Connects the answer to Prisma calls in repositories.

## HTTP and REST

### Junior

**Q: What is the difference between `401` and `403`?**
A: `401` means the caller is not authenticated. `403` means the caller is authenticated
but not allowed to perform the action.

Strong answer signals:

- Points to auth middleware for `401`.
- Points to service ownership checks for `403`.

### Mid-Level

**Q: Why should validation happen before business logic?**
A: The service layer should receive clean, expected data. Validation rejects malformed
input early, prevents mass assignment, and gives clients consistent errors.

Strong answer signals:

- Mentions Zod schemas.
- Mentions `422` responses.
- Explains that TypeScript does not validate runtime requests.

## Architecture

### Junior

**Q: Why split routes, controllers, services, and repositories?**
A: Each layer has one responsibility: routes map URLs, controllers handle HTTP, services
apply business rules, and repositories access the database.

Strong answer signals:

- Can trace one endpoint through the files.
- Explains why controllers should stay thin.

### Mid-Level

**Q: Where should ownership checks live?**
A: In services, because ownership is business authorization, not HTTP formatting or raw
database access.

Strong answer signals:

- Points to project/task service checks.
- Explains how this reduces IDOR risk.

### Senior

**Q: When would this layered architecture become too much or not enough?**
A: It is enough for a small to medium API with clear modules. It may be too much for a
tiny script and not enough for a larger system that needs domain events, background jobs,
observability, or separate services.

Strong answer signals:

- Discusses trade-offs, not rules.
- Keeps the answer grounded in team size and change rate.

## Database and Prisma

### Junior

**Q: Why use migrations?**
A: Migrations version database structure so every environment can apply the same schema
changes predictably.

Strong answer signals:

- Mentions local, test, and CI databases.
- Distinguishes schema from data.

### Mid-Level

**Q: What is the N+1 query problem?**
A: It happens when code loads a list, then runs one query per item for related data.
Prisma can avoid it with explicit `include`, `select`, or better query shape.

Strong answer signals:

- Gives a concrete project/task example.
- Mentions measuring queries before optimizing.

## Authentication and Authorization

### Junior

**Q: Why use bcrypt for passwords?**
A: bcrypt is slow and salted, which makes brute-force attacks more expensive than fast
hashes such as SHA-256.

Strong answer signals:

- Says passwords are never stored plain-text.
- Says hashes should never be returned in responses.

### Mid-Level

**Q: What is IDOR?**
A: Insecure Direct Object Reference: a user changes an ID and accesses another user's
resource because the server forgot an ownership check.

Strong answer signals:

- Connects to project/task ownership checks.
- Explains why hiding IDs is not a fix.

### Senior

**Q: What are JWT trade-offs?**
A: Stateless access tokens scale easily, but revocation is harder before expiry. Refresh
tokens, short expirations, rotation, and server-side token state can reduce risk.

Strong answer signals:

- Mentions payload is encoded, not encrypted.
- Discusses expiry and revocation.

## Testing

### Junior

**Q: Why use Supertest?**
A: It tests the Express app in-process without manually starting a server or binding a
port.

Strong answer signals:

- Mentions the `app.ts` and `server.ts` split.
- Explains integration confidence.

### Mid-Level

**Q: What should an endpoint integration test cover?**
A: It should cover the request, routing, validation, auth, service behavior, persistence,
and response status/body for at least one success and one failure path.

Strong answer signals:

- Mentions test database isolation.
- Mentions `401`, `403`, and `422` paths.

## Production

### Mid-Level

**Q: What would you improve before deploying this API?**
A: Tighten CORS origins, add refresh tokens if needed, add metrics/tracing, request IDs,
secrets management, backups, readiness checks, and deployment-specific configuration.

Strong answer signals:

- Does not list things already present as missing.
- Prioritizes based on risk.
