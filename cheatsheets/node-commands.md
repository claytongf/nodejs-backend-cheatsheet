# Cheatsheet · Node & npm Commands

## Node basics

| Command                | Does                               |
| ---------------------- | ---------------------------------- |
| `node -v`              | Print Node version                 |
| `node file.js`         | Run a JS file                      |
| `npx tsx file.ts`      | Run a TS file directly (this repo) |
| `node --watch file.js` | Re-run on change                   |

## npm

| Command                       | Does                                        |
| ----------------------------- | ------------------------------------------- |
| `npm install`                 | Install all deps from `package.json`        |
| `npm ci`                      | Clean install from `package-lock.json` (CI) |
| `npm install pkg`             | Add a dependency                            |
| `npm install -D pkg`          | Add a dev dependency                        |
| `npm uninstall pkg`           | Remove a dependency                         |
| `npm run <script>`            | Run a script                                |
| `npm outdated`                | List outdated deps                          |
| `npm audit` / `npm audit fix` | Find/fix vulnerable deps                    |

## This project's scripts

| Script                      | Does                         |
| --------------------------- | ---------------------------- |
| `npm run dev`               | Hot-reload dev server (tsx)  |
| `npm run build`             | Compile TS → `dist/`         |
| `npm start`                 | Run compiled build           |
| `npm run lint` / `lint:fix` | ESLint                       |
| `npm run format`            | Prettier write               |
| `npm run typecheck`         | Type-check, no emit          |
| `npm test` / `test:watch`   | Jest                         |
| `npm run prisma:migrate`    | Create+apply migration (dev) |
| `npm run prisma:deploy`     | Apply migrations (prod/CI)   |
| `npm run prisma:studio`     | Open Prisma Studio           |
| `npm run db:seed`           | Seed the database            |

## Useful one-offs

```bash
node -e "console.log(process.version)"   # quick eval
npm ls --depth=0                          # top-level deps
npm pkg get scripts                        # read scripts as JSON
```

## Env & process

| Snippet                     | Meaning         |
| --------------------------- | --------------- |
| `process.env.PORT`          | Read env var    |
| `process.argv`              | CLI arguments   |
| `process.exit(0)`           | Exit (0 = ok)   |
| `process.on('SIGTERM', fn)` | Handle shutdown |
