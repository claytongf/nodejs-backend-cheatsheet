# Practical Labs

Labs turn the repository into active practice. Each lab asks you to change the real Task
Manager API, validate the behavior, and explain the trade-offs as you would in an
interview.

## How to Use the Labs

1. Read the related docs chapter.
2. Run the current test suite.
3. Implement the lab in a small branch or commit.
4. Add or update tests.
5. Run the validation checklist.
6. Answer the interview follow-up questions out loud.

## Lab Index

| Lab | Level | Main Skill |
| --- | --- | --- |
| [01 · Add task priority](01-add-task-priority.md) | Beginner | Schema, validation, CRUD |
| [02 · Filter and paginate tasks](02-filter-and-pagination.md) | Intermediate | Query design, API ergonomics |
| [03 · Add refresh tokens](03-refresh-token.md) | Advanced | Authentication design |
| [04 · Strengthen admin permissions](04-admin-permissions.md) | Intermediate | Authorization and role checks |
| [05 · Debug a broken test](05-debug-broken-test.md) | Intermediate | Testing and diagnosis |
| [06 · Production hardening review](06-production-hardening.md) | Advanced | Security and operations |
| [07 · Cache a read path](07-cache-a-read-path.md) | Advanced (Senior) | Caching & invalidation |
| [08 · Rate-limit the auth endpoints](08-rate-limit-auth-endpoints.md) | Advanced (Senior) | Reliability & security |
| [09 · Correlated request logging](09-correlated-request-logging.md) | Advanced (Senior) | Observability |

## Default Validation

Run this after each implementation lab:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

If the lab changes dependencies or production concerns, also run:

```bash
npm audit --audit-level=moderate
```
