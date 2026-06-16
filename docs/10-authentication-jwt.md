# 10 · Authentication (JWT)

## What it is

**Authentication** answers "who are you?". This project uses **JWT** (JSON Web Tokens):
on login, the server verifies credentials and returns a signed token; the client sends it
back as `Authorization: Bearer <token>` on each request. Passwords are hashed with
**bcrypt**, never stored in plain text.

## Why it matters in backend development

Almost every API needs to know who is calling. Auth done wrong leaks accounts and data.
JWT enables **stateless** auth (no server-side session store), which scales well across
multiple server instances.

## How it appears in real Node.js jobs

You will hash passwords with bcrypt, sign/verify JWTs, write an auth middleware that reads
the token and attaches `req.user`, and protect routes. You will also discuss token
expiry, refresh tokens, and where to store tokens client-side.

## Simple code example

```ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// On register:
const passwordHash = await bcrypt.hash(plainPassword, 10);

// On login:
const ok = await bcrypt.compare(plainPassword, user.passwordHash);
if (!ok) throw new UnauthorizedError('Invalid credentials');

const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
  expiresIn: env.JWT_EXPIRES_IN,
});

// On a protected request:
const payload = jwt.verify(token, env.JWT_SECRET); // throws if invalid/expired
```

## Practical example from this project

The `auth` module handles `POST /auth/register`, `POST /auth/login`, and `GET /auth/me`.
`auth.service.ts` hashes/compares passwords and signs tokens;
[src/middlewares/auth.middleware.ts](../src/middlewares/auth.middleware.ts) verifies the
`Bearer` token, loads the user, and attaches `req.user`. Protected routers add this
middleware before their controllers.

## Laravel comparison

| Laravel | This project |
| --- | --- |
| `Hash::make()` / `Hash::check()` | `bcrypt.hash` / `bcrypt.compare` |
| Sanctum / Passport tokens | `jsonwebtoken` |
| `auth:sanctum` middleware | `auth.middleware.ts` |
| `Auth::user()` | `req.user` |

Laravel Sanctum often stores tokens in the DB; classic JWT is stateless (nothing stored
server-side), which is simpler to scale but harder to revoke.

## Common beginner mistakes

- Storing passwords in plain text or with fast hashes (MD5/SHA) — use bcrypt.
- Putting secrets in code instead of validated env (`JWT_SECRET`).
- Forgetting token **expiry**, or not handling expired-token errors.
- Trusting the JWT payload without verifying the signature.
- Returning `passwordHash` in API responses.

## Best practices

- Hash with bcrypt (cost ≥ 10); never log or return password hashes.
- Keep `JWT_SECRET` long, secret, and validated at startup.
- Set a sensible expiry; consider refresh tokens for long sessions.
- Verify the token signature on every protected request.
- Return `401` for missing/invalid tokens, `403` for forbidden actions.

## Study checklist

- [ ] I can hash and compare passwords with bcrypt.
- [ ] I can sign and verify a JWT.
- [ ] I can write middleware that attaches `req.user`.
- [ ] I know the difference between authentication and authorization.

## Interview questions

**Q: Why bcrypt instead of SHA-256 for passwords?**
A: bcrypt is deliberately slow and salted, which resists brute-force and rainbow-table
attacks. Fast hashes are not designed for passwords.

**Q: What is inside a JWT?**
A: Three parts: header, payload (claims like `sub`, `role`, `exp`), and a signature. The
payload is encoded, not encrypted — never put secrets in it.

**Q: Stateless JWT vs server sessions — trade-off?**
A: JWT scales without shared session storage but is hard to revoke before expiry. Sessions
are easy to revoke but need a shared store.
