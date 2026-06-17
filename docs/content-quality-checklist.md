# Content Quality Checklist

Use this checklist before merging educational or feature changes.

## Documentation Changes

- [ ] The explanation is beginner-friendly without being inaccurate.
- [ ] The chapter or guide links to real project files when relevant.
- [ ] New material fits the existing learning path.
- [ ] Terms are used consistently across docs, examples, labs, and interview prep.
- [ ] Outdated statements were removed instead of copied forward.
- [ ] The content is written in English.

## Chapter Changes

- [ ] The chapter follows [chapter-template.md](chapter-template.md) where practical.
- [ ] It includes why the concept matters in backend development.
- [ ] It includes how the concept appears in real Node.js jobs.
- [ ] It includes a project-specific example.
- [ ] It includes common mistakes and best practices.
- [ ] It includes interview questions or strong-answer signals.

## Code Changes

- [ ] The layered architecture remains clear.
- [ ] Controllers stay thin.
- [ ] Business rules and authorization stay in services.
- [ ] Prisma access stays in repositories.
- [ ] External input is validated with Zod.
- [ ] Swagger is updated for endpoint or response changes.
- [ ] Tests cover success and failure paths.

## Lab Changes

- [ ] The lab has context, requirements, likely files, suggested steps, acceptance criteria,
  and interview follow-ups.
- [ ] The lab is assigned a difficulty level.
- [ ] The lab can be completed using the current repo.
- [ ] The lab tells the learner what to test.

## Interview Prep Changes

- [ ] Questions are grouped by topic and level.
- [ ] Answers include strong-answer signals.
- [ ] The material connects back to this project.
- [ ] Rubrics distinguish junior, mid-level, and senior expectations.

## Validation

Run:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

When dependencies change, also run:

```bash
npm audit --audit-level=moderate
```
