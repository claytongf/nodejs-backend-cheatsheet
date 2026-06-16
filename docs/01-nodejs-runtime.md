# 01 · The Node.js Runtime

## What it is

Node.js is a **JavaScript runtime built on Chrome's V8 engine**. It lets you run
JavaScript outside the browser — on a server, a CLI, or a build tool. It adds APIs the
browser does not have: file system access (`fs`), networking (`http`, `net`), processes,
streams, and modules.

Node is **single-threaded for your code** but uses an **event loop** plus a background
thread pool (libuv) to handle I/O concurrently without you managing threads.

## Why it matters in backend development

- It is one of the most common backend runtimes in the job market.
- Its non-blocking I/O model makes it excellent for **I/O-bound** workloads: APIs,
  real-time apps, proxies, and microservices.
- You write the same language on the server and (often) the client.

## How it appears in real Node.js jobs

You will: pick a Node **LTS** version, manage dependencies with npm, read environment
variables with `process.env`, handle signals (`SIGTERM`) for graceful shutdown, and read
stack traces from the V8 engine. Understanding "single-threaded + event loop" is a
classic interview topic.

## Simple code example

```ts
// hello.ts — the smallest possible Node program
console.log('Running on Node', process.version);
console.log('Platform:', process.platform);

// Node-only APIs:
import { readFileSync } from 'node:fs';
const pkg = readFileSync('package.json', 'utf8');
console.log('Bytes in package.json:', pkg.length);
```

Run it with `tsx hello.ts` or compile first with `tsc`.

## Practical example from this project

[src/server.ts](../src/server.ts) is the runtime entry point. It reads validated config
from `process.env`, starts the HTTP server, and listens for `SIGTERM`/`SIGINT` to shut
down gracefully — all runtime-level concerns.

## Laravel comparison

In Laravel, PHP-FPM spins up a process **per request**: the script runs, responds, and
dies, so global state resets every time. Node is the opposite: **one long-lived process**
handles many requests, so module-level variables persist between requests. That is
powerful (caching, connection pools) but also a footgun (never store per-user state in a
module-level variable).

## Common beginner mistakes

- Blocking the event loop with heavy synchronous work (e.g. `JSON.parse` of a huge file,
  `bcrypt` with sync APIs in a hot path).
- Assuming each request gets a fresh process (it does not).
- Using a random Node version instead of the project's LTS.
- Confusing `require` (CommonJS) with `import` (ES Modules).

## Best practices

- Use an **LTS** Node version; pin it (`.nvmrc`, `engines` in `package.json`).
- Prefer non-blocking/async APIs over their `*Sync` versions in request handlers.
- Read config from `process.env`, but **validate** it (see chapter 07 / `src/config/env.ts`).
- Handle `SIGTERM` for graceful shutdown in containers.

## Study checklist

- [ ] I can explain "single-threaded with an event loop."
- [ ] I know the difference between CommonJS and ES Modules.
- [ ] I know why blocking the event loop is bad.
- [ ] I can read `process.env`, `process.argv`, and `process.version`.

## Interview questions

**Q: Is Node.js single-threaded?**
A: Your JavaScript runs on a single main thread, but Node uses libuv's thread pool and the
OS for I/O, so it handles many concurrent connections without blocking.

**Q: What is V8?**
A: Google's JavaScript engine (also in Chrome). It compiles JS to machine code; Node
embeds it and adds server-side APIs.

**Q: What does "non-blocking I/O" mean?**
A: I/O operations (disk, network) return immediately and notify you later via callbacks/
promises, so the main thread keeps serving other requests instead of waiting.
