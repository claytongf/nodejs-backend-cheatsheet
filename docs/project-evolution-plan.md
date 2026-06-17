# Project Evolution Plan

This plan turns the repository from a strong backend reference into a complete learning,
practice, interview-preparation, and portfolio-preparation system.

The implementation should move in checkpoints. Each checkpoint follows the same cycle:

1. Develop the scoped change.
2. Run the relevant validation commands.
3. Fix anything uncovered by validation.
4. Commit the checkpoint before starting the next phase.

## Guiding Principles

- Keep the project beginner-friendly without hiding real production concerns.
- Prefer practical learning over passive reading.
- Connect every concept to the real Task Manager API.
- Make local setup as reliable as CI.
- Keep documentation, examples, labs, tests, and interview prep aligned.
- Avoid adding dependencies unless they clearly improve the learning path.

## Phase 1: Reliable Foundation

Goal: a learner should be able to clone, install, run, test, and explore the project with
predictable results.

### Scope

- Fix the local test database workflow.
- Add scripts for preparing and migrating the test database.
- Update README setup instructions for development and testing.
- Correct outdated documentation in examples and interview material.
- Add a clear local validation checklist.

### Acceptance Criteria

- A documented local setup path exists for running the API.
- A documented local setup path exists for running tests.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` are expected to pass
  after documented setup.
- Example docs no longer describe dependencies as future or missing when they are already
  installed.
- Interview improvement suggestions do not ask for features that already exist.

## Phase 2: Guided Learning Path

Goal: turn the documentation from reference material into an active study path.

### Scope

- Create a study guide with tracks for beginners, Laravel/PHP developers, junior
  interviews, mid-level interviews, and fast review.
- Define a richer chapter template for future chapter updates.
- Add learning objectives, practice prompts, and self-assessment guidance.
- Make the roadmap explain how to combine chapters, examples, labs, and interview prep.

### Acceptance Criteria

- A learner can choose a track and know what to study first.
- The repository documents how each chapter should support active learning.
- The roadmap points to the new study guide and practice assets.

## Phase 3: Practical Labs

Goal: teach backend development through implementation tasks, debugging tasks, and
production-style exercises.

### Scope

- Add a `labs/` area with beginner, intermediate, and advanced exercises.
- Include labs for schema changes, API changes, filters/pagination, auth/security,
  debugging, and production hardening.
- Each lab must include context, requirements, likely files, acceptance criteria, testing
  guidance, and interview follow-up questions.

### Acceptance Criteria

- Learners can practice by changing the real API.
- Labs are ordered by difficulty.
- Each lab has clear completion criteria.

## Phase 4: Interview Preparation System

Goal: build a structured interview-training toolkit around the project.

### Scope

- Add an `interview-prep/` area.
- Create a question bank grouped by topic and level.
- Add live-coding prompts, debugging prompts, system-design prompts, behavioral prompts,
  mock interview formats, and scoring rubrics.
- Connect strong answers back to the Task Manager API.

### Acceptance Criteria

- Learners can practice short-answer interviews, coding interviews, debugging interviews,
  and project walkthroughs.
- Questions include junior, mid-level, and senior expectations.
- Rubrics explain what strong answers include.

## Phase 5: Portfolio Preparation

Goal: help learners explain the project clearly in job applications and interviews.

### Scope

- Add a portfolio guide.
- Add project walkthrough scripts for 2-minute, 5-minute, and deep technical explanations.
- Add guidance for discussing architecture, security, testing, Swagger, database design,
  trade-offs, and future improvements.
- Add optional portfolio extension ideas.

### Acceptance Criteria

- A learner can explain the project to a recruiter or engineer.
- A learner can connect implementation details to professional backend expectations.
- Extension ideas are scoped enough to become GitHub issues or personal portfolio work.

## Phase 6: Maintenance and Quality System

Goal: keep the learning system consistent as the project evolves.

### Scope

- Add a master learning index that maps chapters to examples, labs, interview prep, and
  real source files.
- Add a content quality checklist.
- Add contribution guidance for new learning material.
- Verify CI and local validation remain aligned.

### Acceptance Criteria

- Contributors know what a complete educational change requires.
- New features are expected to include docs, tests, Swagger updates, and interview/practice
  material when relevant.
- The project has a single index for navigating the learning system.

## Checkpoint Plan

1. Commit the plan document.
2. Implement and commit Phase 1.
3. Implement and commit Phase 2.
4. Implement and commit Phase 3.
5. Implement and commit Phase 4.
6. Implement and commit Phase 5.
7. Implement and commit Phase 6.

## Validation Baseline

Run these commands as the default validation suite unless a checkpoint is documentation-only:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

For dependency security checks, run:

```bash
npm audit --audit-level=moderate
```
