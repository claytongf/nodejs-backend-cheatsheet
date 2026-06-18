# 13 · Security Best Practices

> **Hands-on:** [`examples/13-security`](../examples/13-security) shows each common Node.js
> vulnerability (SQL injection, JWT `alg:none`, mass assignment, ReDoS, prototype pollution,
> timing attacks, error leakage) as runnable *vulnerable vs. fixed* code.

## What it is

The set of habits and controls that keep an API safe: validating input, hashing secrets,
authenticating and authorizing requests, protecting against common web attacks, and not
leaking sensitive data.

## Why it matters in backend development

The backend holds the data and enforces the rules. A single missing check can expose every
user's data. Security is not a feature you add later — it is built into every layer.

## How it appears in real Node.js jobs

You will configure security headers (`helmet`), rate limiting, CORS, input validation,
proper auth/authz, and secret management. Security review is part of code review.

## Checklist of controls (and where this project does them)

| Threat                       | Control                            | Where                                |
| ---------------------------- | ---------------------------------- | ------------------------------------ |
| Injection / bad input        | Zod validation                     | `*.schemas.ts` + validate middleware |
| Credential theft             | bcrypt password hashing            | `auth.service.ts`                    |
| Forged identity              | JWT signature verification         | `auth.middleware.ts`                 |
| Broken access control (IDOR) | role + ownership checks            | services                             |
| Secret leakage               | env validation, `.env` git-ignored | `config/env.ts`, `.gitignore`        |
| Info leakage                 | safe error responses               | `error.middleware.ts`                |
| (Recommended) Header attacks | `helmet`                           | add in `app.ts`                      |
| (Recommended) Brute force    | rate limiting                      | add in `app.ts`                      |
| (Recommended) Cross-origin   | configured CORS                    | add in `app.ts`                      |

## Simple code example

```ts
// Recommended hardening to add in app.ts (not bundled to keep deps minimal):
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet()); // safe HTTP headers
app.use(rateLimit({ windowMs: 60_000, max: 100 })); // basic brute-force protection
```

## Practical example from this project

The codebase already validates env at startup, hashes passwords, verifies JWTs, enforces
ownership, never returns `passwordHash`, and returns generic `500` messages without stack
traces. The recommended `helmet`/rate-limit lines are documented here as the next hardening
step.

## Laravel comparison

| Laravel                                      | Node equivalent                                        |
| -------------------------------------------- | ------------------------------------------------------ |
| CSRF middleware (web)                        | Not needed for stateless token APIs; use SameSite/CORS |
| `$fillable`/`$guarded` mass-assignment guard | Zod schemas (only accept known fields)                 |
| `Hash`, `bcrypt`                             | `bcryptjs`                                             |
| `.env` + `config()`                          | `.env` + validated `config/env.ts`                     |
| Throttling middleware                        | `express-rate-limit`                                   |

## Common beginner mistakes

- Committing `.env` or secrets to git.
- Returning stack traces / DB errors to clients.
- Mass assignment: passing `req.body` straight into the DB (accept only validated fields).
- Logging passwords, tokens, or full request bodies.
- Disabling TLS/HTTPS in production.

## Best practices

- Validate everything at the boundary; accept only known fields.
- Hash secrets, never store or log them in plain text.
- Authenticate then authorize; always check ownership.
- Keep secrets in validated env; rotate them; never commit them.
- Add `helmet`, rate limiting, and CORS before going public.
- Keep dependencies updated (`npm audit`).

## Study checklist

- [ ] I can list the OWASP-style threats relevant to an API.
- [ ] I validate input and reject unknown fields.
- [ ] I never leak secrets, hashes, or stack traces.
- [ ] I know what helmet, rate limiting, and CORS do.

## Interview questions

**Q: How do you protect against mass assignment?**
A: Validate input with a schema and only persist the explicitly allowed fields, never the
raw request body.

**Q: Why not return the real error message in production?**
A: It can leak implementation details (DB structure, file paths) that help attackers. Log
it server-side; return a generic message.

**Q: What does `helmet` do?**
A: Sets safe HTTP response headers (e.g. `X-Content-Type-Options`, `Strict-Transport-
Security`) to mitigate common browser-based attacks.
