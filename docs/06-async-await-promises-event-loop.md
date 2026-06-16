# 06 · Async/await, Promises & the Event Loop

## What it is

A **Promise** represents a value that will be available later. **`async/await`** is syntax
for working with promises as if they were synchronous. The **event loop** is the mechanism
that lets a single-threaded Node process schedule and run all this async work.

## Why it matters in backend development

Every database call, HTTP request, and file read is asynchronous. If you do not understand
promises and the event loop, you will write race conditions, unhandled rejections, and
code that blocks the whole server.

## The event loop in one paragraph

Node runs your synchronous code, then processes **microtasks** (resolved promises), then
**macrotasks** (timers, I/O callbacks), looping forever. `await` pauses the current async
function and yields control back to the loop, so other work can run while you wait.

## How it appears in real Node.js jobs

You will `await` Prisma queries, run independent calls in parallel with `Promise.all`,
avoid blocking the loop with CPU-heavy work, and debug "UnhandledPromiseRejection"
warnings. Interviewers love the "what logs first?" event-loop puzzle.

## Simple code example

```ts
// Order: sync → microtask → macrotask
console.log('1: sync');

setTimeout(() => console.log('4: macrotask (timer)'), 0);

Promise.resolve().then(() => console.log('3: microtask'));

console.log('2: sync');
// Output: 1, 2, 3, 4
```

```ts
// Run independent work in parallel:
const [user, projects] = await Promise.all([
  usersRepository.findById(id),
  projectsRepository.findByOwner(id),
]);
```

## Practical example from this project

Every controller in `src/modules/` is `async` and `await`s its service, which `await`s the
repository's Prisma call. The `asyncHandler` wrapper in `src/shared/utils/` forwards any
rejected promise to the error middleware, so you never need a `try/catch` in every
controller.

## Laravel comparison

PHP is mostly **synchronous**: each line runs to completion before the next. Laravel hides
"waiting" because PHP-FPM gives every request its own process. In Node, a single process
serves many requests, so "waiting" must be non-blocking — hence promises and `await`.
Laravel queues handle background work the way Node's async I/O handles concurrent waiting.

## Common beginner mistakes

- Forgetting `await`, so you use a `Promise` object instead of its value.
- Using `forEach` with `async` (it does not wait) — use `for...of` or `Promise.all`.
- Awaiting sequentially when calls are independent (slow) instead of `Promise.all`.
- Swallowing errors by not handling rejections.
- Blocking the loop with sync crypto/JSON on large inputs.

## Best practices

- Always `await` (or explicitly `.catch`) every promise.
- Use `Promise.all` for independent work; sequence only when there is a dependency.
- Wrap async route handlers so errors reach the error middleware.
- Keep CPU-heavy work off the main loop (offload to a worker/queue — chapter 14).

## Study checklist

- [ ] I can predict the output of a sync/microtask/macrotask example.
- [ ] I know when to use `Promise.all` vs sequential `await`.
- [ ] I understand why `forEach` + `async` does not wait.
- [ ] I know what an unhandled rejection is and how to avoid it.

## Interview questions

**Q: What is the difference between microtasks and macrotasks?**
A: Microtasks (promise callbacks) run before the next macrotask (timers, I/O). After each
macrotask, Node drains the entire microtask queue.

**Q: Does `await` block the thread?**
A: No. It pauses the current async function and returns control to the event loop, which
keeps serving other work.

**Q: How do you run three independent async calls efficiently?**
A: `await Promise.all([a(), b(), c()])` so they run concurrently instead of one after
another.
