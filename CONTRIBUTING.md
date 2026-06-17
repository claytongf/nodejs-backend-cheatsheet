# Contributing

Thanks for your interest in improving **nodejs-backend-cheatsheet**! This is a learning
repository, so contributions that make concepts **clearer** are just as valuable as code.

All contributions must be in **English**.

## Ways to contribute

### 📝 Documentation improvements

- Fix typos, clarify explanations, improve examples.
- Keep the chapter structure (explanation → why → jobs → examples → Laravel comparison → mistakes → best practices → checklist → interview Q&A).
- Use [docs/chapter-template.md](docs/chapter-template.md) for new or heavily revised chapters.
- Use [docs/content-quality-checklist.md](docs/content-quality-checklist.md) before opening a pull request.

### 🧩 New examples

- Add small, **isolated**, runnable examples under `examples/`.
- One concept per example. Include a short `README.md` explaining how to run it.

### 🐛 Bug fixes

- Open an issue describing the bug (use the bug report template).
- Add or update a test that reproduces the bug.

### ✅ Tests

- Use Jest + Supertest. Test public HTTP behavior.
- Add a happy-path and a failure-path test for new endpoints.

### ⚡ New cheatsheets

- Keep them concise and scannable: tables, short snippets, common commands.

### 💡 Suggestions

- Open a documentation issue and tell us what was confusing or missing.

### Learning assets

- Add practical exercises under `labs/` when a topic needs hands-on practice.
- Add interview material under `interview-prep/` when a topic is commonly discussed in
  job interviews.
- Keep [docs/learning-index.md](docs/learning-index.md) aligned when adding major learning
  assets.

## Development setup

```bash
npm install
cp .env.example .env
docker compose up -d
npm run prisma:migrate
npm run dev
```

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm run build
npm run db:test:setup
npm test
```

Then:

1. Create a branch: `git checkout -b docs/improve-zod-chapter`.
2. Make focused commits with clear English messages.
3. Fill out the pull request template.

## Style guidelines

- Follow the existing architecture (`routes → controller → service → repository`).
- Prefer clarity over cleverness; avoid unnecessary abstractions.
- Use meaningful names and small functions.
- Run Prettier (`npm run format`) before committing.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
