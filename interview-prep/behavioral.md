# Behavioral Interview Preparation

Use the STAR format: Situation, Task, Action, Result. Keep answers specific and connected
to real work.

## Project Ownership

**Question:** Tell me about a project you built and what you are proud of.

Strong answer structure:

- Situation: You wanted a practical backend learning project.
- Task: Build a real API with docs, tests, auth, database, and deployment basics.
- Action: Explain the layered architecture and validation/testing choices.
- Result: The project became runnable, testable, and useful for portfolio discussion.

## Debugging

**Question:** Tell me about a time you debugged a difficult issue.

Strong answer structure:

- Situation: A test failed or behavior did not match expected auth rules.
- Task: Identify whether the issue was test setup, middleware, service logic, or DB state.
- Action: Trace the request through layers and add a regression test.
- Result: The fix improved both correctness and confidence.

## Learning Quickly

**Question:** How do you learn a new backend technology?

Strong answer structure:

- Start with the core concept.
- Build a minimal example.
- Use it in a real feature.
- Test it.
- Explain trade-offs.

Connect this to how the repository uses examples, docs, labs, and the real API.

## Trade-Offs

**Question:** Tell me about a technical decision you made.

Strong answer structure:

- Decision: Use layered modules without a dependency-injection framework.
- Reason: Clear responsibilities, easier testing, and beginner readability.
- Trade-off: More files than a tiny app, but better structure for auth and ownership.
- Result: New modules can follow a predictable pattern.

## Team Communication

**Question:** How do you handle code review feedback?

Strong answer structure:

- Clarify the concern.
- Separate style preference from correctness.
- Make the smallest useful change.
- Add tests or docs when behavior is affected.
- Explain the final trade-off.
