# 24 · Caching

## Learning Objective

By the end of this chapter, you should be able to apply the cache-aside pattern, choose a
TTL, invalidate correctly, and explain the trade-off between speed and staleness.

## What It Is

A cache stores the result of expensive work (a slow query, an external API call) so the next
request can skip the work. The most common server pattern is **cache-aside**:

1. Read from the cache.
2. On a **hit**, return it.
3. On a **miss**, do the real work, store it in the cache, then return it.

Each entry has a **TTL** (time to live) after which it is considered stale.

## Why It Matters in Backend Development

Caching is one of the biggest performance levers — turning a 200ms query into a sub-
millisecond lookup. But it introduces the hardest problem in computing: **invalidation**. A
cache that serves stale data quietly is worse than no cache.

## How It Appears in Real Node.js Jobs

- A shared **Redis** cache sits in front of expensive reads, shared across all app instances.
- TTLs are tuned per data type (a config that rarely changes vs a feed that changes often).
- Writes invalidate (delete) the affected keys so readers do not see old data.
- Engineers debate cache keys, TTLs, and the "thundering herd" when many requests miss at once.

## Simple Code Example

```ts
// Cache-aside: serve from cache, otherwise load and store.
const value = await cache.wrap(`user:${id}`, () => usersRepository.findById(id));

// On update, invalidate so the next read reloads fresh data.
await usersRepository.update(id, data);
cache.delete(`user:${id}`);
```

## Practical Example from This Project

This repo includes a dependency-free, tested cache utility:

- [src/shared/utils/cache.ts](../src/shared/utils/cache.ts) — `TtlCache` implements
  `get`/`set`/`delete` and a `wrap` cache-aside helper with per-entry TTL.
- [src/tests/cache.test.ts](../src/tests/cache.test.ts) — proves hits, misses, expiry, and
  that `wrap` only loads once on a miss.

It is intentionally **not** wired into the mutable task/user endpoints, because caching
owner-scoped, frequently-updated data needs careful invalidation — and a stale read of
someone's tasks is exactly the kind of bug this chapter warns about. The Guided Exercise
below adds it to a safe read path so you practice invalidation deliberately.

In production you would swap the in-memory map for **Redis** (the repo already provisions
Redis in `docker-compose.yml` and validates `REDIS_URL` in
[config/env.ts](../src/config/env.ts)); the `wrap`/`get`/`set`/`delete` interface stays the
same, but the cache becomes shared across processes and survives restarts.

## Guided Exercise

1. In the users module, cache `usersService.getById` reads with a `TtlCache` keyed by
   `user:${id}`.
2. In `update` and `delete`, call `cache.delete('user:' + id)` to invalidate.
3. Add a test proving an update is visible on the next read (no stale data).

## Practical Challenge

Explain (and sketch) how you would prevent a **thundering herd**: when a hot key expires and
100 requests miss simultaneously, they all hit the database at once. Acceptance criteria:
describe at least one mitigation (single-flight/locking, or staggered TTLs with jitter).

## Common Beginner Mistakes

- Caching without an invalidation plan, so writes leave stale reads.
- Caching per-user data under a shared key (one user sees another's data).
- TTLs so long that data is stale, or so short the cache barely helps.
- Caching in-process and assuming it is shared across instances (it is not).
- Caching error responses or empty results unintentionally.

## Best Practices

- Prefer cache-aside; invalidate on write.
- Include everything that affects the result in the cache key (e.g. user id, filters).
- Choose TTLs per data type; add jitter to avoid synchronized expiry.
- Use a shared cache (Redis) once you run more than one instance.
- Never cache secrets or per-user data under a shared key.

## Study Checklist

- [ ] I can describe the cache-aside pattern.
- [ ] I can explain TTL and cache invalidation.
- [ ] I know why an in-process cache is not shared across instances.
- [ ] I can read `TtlCache` and explain `wrap`.

## Interview Questions

**Q: Explain cache-aside.**
A: The app checks the cache first; on a miss it loads from the source, stores the result,
and returns it. Writes invalidate the affected keys.

**Q: Why is cache invalidation hard?**
A: You must delete or update every cache entry affected by a write, across every instance,
without races — miss one and readers see stale data.

**Q: In-memory cache vs Redis?**
A: In-memory is fast but per-process and lost on restart; Redis is shared across instances,
survives restarts, and supports eviction and TTLs centrally.

## Strong Answer Signals

A strong answer treats invalidation as the hard part, mentions keying by all inputs, picks
TTLs per data type, and raises the thundering-herd problem with a mitigation.
</content>
