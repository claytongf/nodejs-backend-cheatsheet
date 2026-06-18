# 11 · Queues & Workers

Offload slow work (email, image processing, third-party calls) to a background worker so
HTTP handlers stay fast.

```bash
npx tsx examples/11-queues-workers/index.ts
```

This uses a plain in-memory queue with **zero dependencies** so you can watch the mechanics:
enqueue → worker pulls → process → **retry with a dead-letter** for jobs that keep failing.

In production you'd back this with **Redis + BullMQ** so jobs survive restarts and many
workers can process them across machines. The producer/consumer shape stays the same.

Related: [docs/14-queues-workers-redis.md](../../docs/14-queues-workers-redis.md) ·
[Lab 07 — cache a read path](../../labs/07-cache-a-read-path.md)
