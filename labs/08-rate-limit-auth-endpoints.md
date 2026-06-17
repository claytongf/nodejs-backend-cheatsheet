# 08 · Rate-Limit the Auth Endpoints

Level: Advanced

## Context

A global rate limiter is already mounted in [app.ts](../src/app.ts), but login and register
deserve a **stricter** limit to slow brute-force and credential-stuffing attacks. This lab
adds a per-route limiter without throttling the rest of the API.

Read [21 · Reliability & resilience](../docs/21-reliability-and-resilience.md) and
[13 · Security best practices](../docs/13-security-best-practices.md) first.

## Requirements

- Add a dedicated limiter (e.g. 5 requests/minute) to `POST /auth/login` and
  `POST /auth/register`.
- Keep the limit relaxed in the test environment so the suite is not throttled, matching the
  pattern already used for the global limiter.
- Return `429 Too Many Requests` when the limit is exceeded.

## Likely Files

- `src/modules/auth/auth.routes.ts`
- `src/app.ts` (reference for the existing limiter pattern and `env.NODE_ENV` check)
- `src/tests/auth.test.ts`

## Suggested Steps

1. Create `const authLimiter = rateLimit({ windowMs: 60_000, max: env.NODE_ENV === 'test' ? 1000 : 5 })`.
2. Mount it on the login and register routes (before `validate`).
3. Add a test that issues rapid login attempts and asserts a `429` once the limit is passed
   (temporarily lower the test `max`, or test against the configured value).
4. Confirm other endpoints are unaffected.
5. Run the validation checklist.

## Acceptance Criteria

- Exceeding the login limit returns `429`.
- Other endpoints are not throttled by this limiter.
- The test suite still passes (limiter relaxed under `NODE_ENV=test`).

## Interview Follow-Ups

- Why limit auth endpoints harder than the rest of the API?
- Why is an in-memory limiter insufficient across multiple instances, and what fixes it?
- Per-IP vs per-account rate limiting — what attack does each address?
</content>
