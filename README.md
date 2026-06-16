# Node.js Backend Cheatsheet 🚀

A practical Node.js backend learning repository, built in **small, professional, portfolio-friendly phases**.

> This project grows step by step. You are looking at an early phase — the foundation.
> Each commit leaves the project in a working state.

## Goal

A study guide, cheat sheet, and working API example for learning modern Node.js backend
development with TypeScript. Documentation is in **English** and (in later phases) includes
**Laravel → Node.js** comparisons for developers coming from PHP/Laravel.

## Tech stack (foundation)

| Area | Tool |
| --- | --- |
| Runtime | Node.js LTS (20+) |
| Language | TypeScript (strict) |
| Web framework | Express |
| Dev runner | tsx |
| Config | dotenv |
| Linting | ESLint |
| Formatting | Prettier |
| Editor config | EditorConfig |

More of the stack (Prisma, PostgreSQL, Zod, JWT, Jest, Docker, ...) arrives in later phases.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Run the entry point with hot reload (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled output |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | Type-check without emitting |

## Project structure (so far)

```text
nodejs-backend-cheatsheet/
├── src/
│   └── index.ts          # temporary entry point (replaced next phase)
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── .editorconfig
├── .env.example
└── .gitignore
```

## Roadmap

This repository is developed in phases (foundation → Express app → docs → examples →
layered API → validation → Prisma → auth → resources → tests → production → CI/community).

## License

MIT (added with the community files in a later phase).
