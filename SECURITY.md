# Security Policy

This is an educational repository, but we still take security seriously — partly
because **teaching secure patterns is one of its goals**.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |

## Reporting a vulnerability

If you find a security issue (in the sample code or in a dependency):

1. **Do not** open a public issue with exploit details.
2. Email the maintainers or use GitHub's private "Report a vulnerability" feature.
3. Include steps to reproduce, affected files, and the potential impact.

We aim to acknowledge reports within a few days.

## Security practices demonstrated in this project

- Passwords are hashed with **bcrypt** (never stored in plain text).
- Authentication uses **JWT** with a secret loaded from validated environment config.
- Environment variables are **validated at startup** (`src/config/env.ts`).
- Input is validated with **Zod** before reaching business logic.
- Authorization uses **role checks** plus **ownership checks**.
- Secrets live in `.env`, which is **git-ignored**; `.env.example` ships safe placeholders.

See [docs/13-security-best-practices.md](docs/13-security-best-practices.md) for the full discussion.

## Responsible use

The example code is meant for learning. Before using any of it in production,
review the security chapter, rotate all secrets, and add rate limiting, HTTPS,
and proper monitoring.
