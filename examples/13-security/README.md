# 13 · Common Vulnerabilities & Fixes

The bugs that show up in real Node.js code reviews and security interviews, each shown as
**vulnerable vs. fixed** with proof printed to the console.

```bash
npx tsx examples/13-security/index.ts
```

Covered:

| # | Vulnerability | Fix |
|---|---------------|-----|
| 1 | SQL injection (string-built queries) | Parameterized queries / Prisma / `$queryRaw` tagged templates |
| 2 | JWT `alg: none` & weak verification | Pin `algorithms`, set expiry, verify issuer/audience |
| 3 | Mass assignment / over-posting | Allowlist editable fields (Zod schema) |
| 4 | ReDoS (catastrophic backtracking) | Linear-time regex; bound input length |
| 5 | Prototype pollution | Reject `__proto__`/`constructor`/`prototype` keys |
| 6 | Non-constant-time secret compare | `crypto.timingSafeEqual` |
| 7 | Error/secret leakage to clients | Log server-side, return a generic message |

## How to find and fix issues in YOUR project

- **`npm audit` / `npm audit fix`** — flags known-vulnerable dependencies. Run it in CI.
- **Keep dependencies current** — Dependabot/Renovate; most real breaches start with an old lib.
- **Static analysis** — `eslint` security rules, `semgrep`, CodeQL.
- **Secrets scanning** — `gitleaks`/`trufflehog` so keys never land in git history.
- **Validate every external input** with Zod at the edge ([docs/07](../../docs/07-validation-with-zod.md)).
- **Apply the platform defenses** the app already ships: `helmet`, CORS allowlist,
  rate limiting, bcrypt password hashing, and per-resource ownership checks.

### What this repo does NOT need to worry about (but you should know why)

- **NoSQL operator injection** — a Mongo concern; Prisma + PostgreSQL with typed queries
  is not vulnerable in the same way, but never pass raw user objects as query filters.
- **SSRF** — only relevant once you make outbound requests from user-supplied URLs;
  validate/allowlist the host and block internal IP ranges.

Related: [docs/13-security-best-practices.md](../../docs/13-security-best-practices.md) ·
[Lab 08 — rate-limit auth endpoints](../../labs/08-rate-limit-auth-endpoints.md) ·
[OWASP Top 10](https://owasp.org/www-project-top-ten/)
