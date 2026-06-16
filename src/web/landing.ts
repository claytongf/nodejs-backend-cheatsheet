// A minimal, dependency-free landing page served at GET /.
// This is intentionally NOT a frontend app — just a single static HTML page that
// points visitors to the live API surfaces and the learning material.

// Placeholder — replace with your real repository URL.
const REPO_URL = 'https://github.com/your-username/nodejs-backend-cheatsheet';

export const landingPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Node.js Backend Cheatsheet API</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        max-width: 720px; margin: 3rem auto; padding: 0 1.25rem; line-height: 1.6;
      }
      h1 { margin-bottom: 0.25rem; }
      .tagline { color: #6b7280; margin-top: 0; }
      ul { padding-left: 1.1rem; }
      li { margin: 0.4rem 0; }
      code { background: rgba(127,127,127,0.18); padding: 0.1rem 0.35rem; border-radius: 4px; }
      a { color: #2563eb; text-decoration: none; }
      a:hover { text-decoration: underline; }
      footer { margin-top: 2.5rem; color: #6b7280; font-size: 0.9rem; }
    </style>
  </head>
  <body>
    <h1>Node.js Backend Cheatsheet 🚀</h1>
    <p class="tagline">
      A practical Task Manager API for learning modern Node.js backend development
      (TypeScript, Express, Prisma, PostgreSQL, JWT, Zod, tests, Docker).
    </p>

    <p>
      This is a <strong>backend</strong> project — there is no full frontend. The pages and
      links below are the available browser entry points.
    </p>

    <h2>Live endpoints</h2>
    <ul>
      <li><a href="/api-docs">/api-docs</a> — interactive API documentation (Swagger UI)</li>
      <li><a href="/health">/health</a> — health check</li>
    </ul>

    <h2>Learn more</h2>
    <ul>
      <li><a href="${REPO_URL}">GitHub repository</a> (replace the placeholder URL)</li>
      <li><a href="${REPO_URL}/tree/main/docs">Documentation folder</a> — chapters 00–18</li>
      <li><a href="${REPO_URL}/blob/main/docs/00-roadmap.md">Learning roadmap</a></li>
    </ul>

    <h2>Quick start</h2>
    <p>
      Authenticate via <code>POST /auth/login</code>, then send the returned JWT as
      <code>Authorization: Bearer &lt;token&gt;</code>. Seeded demo login:
      <code>user@demo.test</code> / <code>password123</code>.
    </p>

    <footer>Node.js Backend Cheatsheet — MIT licensed.</footer>
  </body>
</html>
`;
