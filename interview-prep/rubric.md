# Interview Rubric

Use this rubric to score answers and practice sessions.

## Score Levels

| Score | Meaning |
| --- | --- |
| 1 | Incorrect or too vague to evaluate. |
| 2 | Partially correct but misses important risks. |
| 3 | Correct basic answer. |
| 4 | Correct answer with project-specific evidence. |
| 5 | Strong answer with trade-offs, risks, and verification. |

## Junior Backend Signals

A strong junior candidate can:

- Explain HTTP status codes used by the API.
- Trace a request from route to response.
- Explain why validation is needed at runtime.
- Write or understand a basic Supertest integration test.
- Explain authentication vs authorization.

## Mid-Level Backend Signals

A strong mid-level candidate can:

- Defend controller/service/repository separation.
- Explain ownership checks and IDOR prevention.
- Discuss Prisma migrations and test database isolation.
- Add a feature across schema, validation, service, docs, and tests.
- Explain production risks without overengineering.

## Senior Backend Signals

A strong senior candidate can:

- Discuss when the architecture should evolve.
- Identify operational gaps such as metrics, readiness, backups, and secret rotation.
- Design multi-tenant or queue-based extensions.
- Balance correctness, simplicity, and team onboarding.
- Explain migration and rollout risks.

## Red Flags

- Treating JWT payloads as encrypted.
- Confusing `401` and `403`.
- Trusting TypeScript for request validation.
- Calling database code from controllers in this architecture.
- Ignoring ownership checks because routes are authenticated.
- Claiming tests are unnecessary for auth behavior.
