# 07 · Cache a Read Path

Level: Advanced

## Context

The repo ships a dependency-free [`TtlCache`](../src/shared/utils/cache.ts) (cache-aside,
with TTL) and tests for it, but it is intentionally **not** wired into any endpoint, because
caching mutable, owner-scoped data requires careful invalidation. This lab makes you do that
invalidation correctly.

Read [24 · Caching](../docs/24-caching.md) first.

## Requirements

- Cache `usersService.getById` reads with a `TtlCache` keyed by `user:<id>`.
- Invalidate the key on every write (`update`, `delete`) so reads never go stale.
- Prove with a test that an update is visible on the very next read.

## Likely Files

- `src/modules/users/users.service.ts`
- `src/shared/utils/cache.ts` (reuse — do not reimplement)
- `src/tests/users.test.ts` (or a new test file)

## Suggested Steps

1. Create a module-level `const userCache = new TtlCache<User>(30_000)`.
2. In `getById`, use `userCache.wrap('user:' + id, () => repo.findById(id))`.
3. In `update` and `delete`, call `userCache.delete('user:' + id)` after the write.
4. Add a test: read a user (warm the cache), update the name, read again, assert the new
   name (no stale data).
5. Run the validation checklist.

## Acceptance Criteria

- A second read of the same user does not hit the repository (verify with a spy or a counter).
- After an update, the next read returns fresh data.
- TTL still expires entries (covered by the existing cache tests).
- No per-user data is ever cached under a shared key.

## Interview Follow-Ups

- Why is cache invalidation harder than caching itself?
- Why is this in-memory cache wrong once you run more than one instance, and what replaces it?
- What is the thundering-herd problem, and how would you mitigate it here?
</content>
