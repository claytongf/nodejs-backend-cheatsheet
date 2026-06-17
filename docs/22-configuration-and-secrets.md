# 22 · Configuration & Secrets

## Learning Objective

By the end of this chapter, you should be able to manage configuration the 12-factor way:
validate it at startup, keep secrets out of the codebase, and use one typed config object
everywhere.

## What It Is

Configuration is everything that changes between environments — ports, database URLs, API
keys, log levels. Secrets are the sensitive subset (passwords, tokens, signing keys). The
goal is to inject them from the environment, never hard-code them, and fail fast if they are
missing or malformed.

## Why It Matters in Backend Development

A leaked secret in git history is a security incident. A typo in a production env var that
only crashes at 2am is an outage. Validating config at boot turns both classes of problem
into a clear, immediate startup error.

## How It Appears in Real Node.js Jobs

- Secrets live in a secret manager (AWS Secrets Manager, Vault, platform env vars), injected
  at deploy time — not in `.env` committed to the repo.
- The app validates required config on startup and refuses to boot if it is invalid.
- The same build runs in dev, staging, and prod; only the environment differs (12-factor).

## Simple Code Example

```ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  process.exit(1); // fail fast
}
export const env = parsed.data; // typed, validated, used everywhere
```

## Practical Example from This Project

[src/config/env.ts](../src/config/env.ts) is exactly this pattern: a Zod schema validates
`process.env` at startup and **the app refuses to boot** on invalid config. The rest of the
code imports the typed `env` object — never `process.env.FOO` directly. That single rule
gives you autocompletion, type safety, and one place to see every setting.

- [.env.example](../.env.example) documents every variable (committed).
- `.env` holds real local values (git-ignored).
- [.env.test](../.env.test) isolates the test configuration.

To add a variable, follow [Cookbook #10](cookbook.md#10-add-an-environment-variable).

## Laravel Comparison

| Laravel | This project |
| --- | --- |
| `config/*.php` + `env()` | typed `env` object from `config/env.ts` |
| `.env` / `.env.example` | same idea, same filenames |
| `php artisan config:cache` | config validated once at startup |

A key difference: here, accessing `process.env` directly throughout the code is discouraged
— you read the validated `env` object instead, similar to reading `config()` rather than
`env()` in Laravel.

## Guided Exercise

1. Temporarily set `JWT_SECRET=short` in `.env` and run `npm run dev`.
2. Observe the app refuse to boot with a clear validation error.
3. Restore a valid secret and confirm it starts.

## Practical Challenge

Add an optional `CORS_ORIGIN` variable, validate it in `env.ts`, and use it to restrict
`cors()` in [app.ts](../src/app.ts) to that origin when set (allow all when unset).
Acceptance criteria: invalid values fail at startup; the default behavior is unchanged.

## Common Beginner Mistakes

- Committing real secrets in `.env` (always git-ignore it; commit only `.env.example`).
- Reading `process.env.X` scattered across the code with no validation.
- Discovering a missing variable only when a request hits the code path that needs it.
- Different config shapes per environment instead of one schema.

## Best Practices

- Validate all config at startup; fail fast on errors.
- Use one typed config object; never touch `process.env` elsewhere.
- Keep secrets out of git; inject them from the environment/secret manager.
- Commit a complete `.env.example` so new contributors know what is required.

## Study Checklist

- [ ] I can explain "fail fast" config validation and why it helps.
- [ ] I know why `.env` is git-ignored but `.env.example` is committed.
- [ ] I can add a validated variable end to end.
- [ ] I can explain the 12-factor "config in the environment" rule.

## Interview Questions

**Q: Why validate environment variables at startup?**
A: To fail fast with a clear error instead of crashing later in a random code path, and to
get a single typed source of truth for configuration.

**Q: How do you keep secrets out of source control?**
A: Git-ignore `.env`, commit only `.env.example`, and inject real secrets from the
environment or a secret manager at deploy time.

**Q: What does "config in the environment" (12-factor) mean?**
A: Build one artifact and configure it per environment via environment variables, so the
same code runs in dev, staging, and prod with no code changes.

## Strong Answer Signals

A strong answer mentions fail-fast validation, a single typed config object, secret managers
over committed files, and rotating a leaked secret (not just deleting it from git, since git
history and caches persist).
</content>
