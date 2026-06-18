# 14 · Queues, Workers & Redis

> **Hands-on:** [`examples/11-queues-workers`](../examples/11-queues-workers) is a runnable,
> dependency-free queue + worker (enqueue → process → retry → dead-letter) that mirrors the
> BullMQ/Redis pattern described below.

## What it is

A **queue** lets you push slow or non-urgent work (sending email, generating reports,
processing uploads) into a list that a separate **worker** process handles in the
background. **Redis** is an in-memory data store commonly used as the queue backend (e.g.
via BullMQ).

## Why it matters in backend development

HTTP requests should be fast. If a request triggers a 10-second job, the user waits and the
event loop is tied up. Queues let you respond immediately ("accepted") and do the heavy
work asynchronously, improving responsiveness and reliability (jobs can retry).

## How it appears in real Node.js jobs

You will offload emails, notifications, image processing, and scheduled tasks to queues,
run worker processes separately from the API, and monitor failed jobs and retries.

## Simple code example

```ts
// Conceptual example with BullMQ (not bundled; see docker-compose Redis service).
import { Queue, Worker } from 'bullmq';

const connection = { url: process.env.REDIS_URL };
const emailQueue = new Queue('email', { connection });

// Producer (inside an HTTP handler): enqueue and return fast.
await emailQueue.add('welcome', { userId });

// Consumer (a separate worker process):
new Worker(
  'email',
  async (job) => {
    await sendWelcomeEmail(job.data.userId);
  },
  { connection },
);
```

## Practical example from this project

`docker-compose.yml` already provisions a **Redis** service so you can add a queue without
extra setup. A natural extension for this Task Manager is to enqueue a "task assigned"
notification when a task is created, keeping `POST /tasks` fast.

## Laravel comparison

| Laravel                     | Node equivalent               |
| --------------------------- | ----------------------------- |
| `php artisan queue:work`    | a BullMQ `Worker` process     |
| `Job` classes               | job handlers / processors     |
| `dispatch(new SendEmail())` | `queue.add('email', data)`    |
| Redis/database/SQS drivers  | Redis (BullMQ), etc.          |
| `php artisan schedule:run`  | BullMQ repeatable jobs / cron |

If you have used Laravel queues, the mental model transfers directly.

## Common beginner mistakes

- Doing slow work inside the request instead of enqueuing it.
- No retry/backoff strategy, so transient failures lose jobs.
- Running the worker in the same process as the API (it competes for the event loop).
- Putting huge payloads in the job instead of an ID to look up.
- Forgetting that jobs can run more than once — make them **idempotent**.

## Best practices

- Keep request handlers fast; enqueue slow work.
- Run workers as separate processes/containers.
- Configure retries with backoff; handle and monitor failures.
- Store minimal data in jobs (IDs, not whole objects).
- Make job handlers idempotent.

## Study checklist

- [ ] I can explain why and when to use a queue.
- [ ] I know the producer/consumer (queue/worker) split.
- [ ] I understand retries and idempotency.
- [ ] I know why workers run as separate processes.

## Interview questions

**Q: When should work go into a queue?**
A: When it is slow, can fail and should retry, can run later, or would otherwise block the
request (emails, reports, third-party calls, media processing).

**Q: Why must jobs be idempotent?**
A: Queues can deliver/retry a job more than once; idempotent handlers produce the same
result without duplicating side effects.

**Q: Why Redis for queues?**
A: It is fast, in-memory, and supports the data structures (lists, streams) that queue
libraries like BullMQ build on.
