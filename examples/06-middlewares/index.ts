// 06 · The middleware pipeline — functions that run in order.
// Run: npx tsx examples/06-middlewares/index.ts
// Try:  curl http://localhost:4002/secret               -> 401
//       curl -H "x-api-key: secret" http://localhost:4002/secret  -> 200

import express, { type Request, type Response, type NextFunction } from 'express';

const app = express();

// 1) Logging middleware — runs for every request.
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass control to the next handler
});

// 2) A guard middleware applied to a single route.
function requireApiKey(req: Request, res: Response, next: NextFunction) {
  if (req.headers['x-api-key'] !== 'secret') {
    return res.status(401).json({ message: 'Missing or invalid API key' });
  }
  next();
}

app.get('/secret', requireApiKey, (_req, res) => {
  res.json({ message: 'You found the secret!' });
});

app.listen(4002, () => console.log('Middleware demo on http://localhost:4002'));
