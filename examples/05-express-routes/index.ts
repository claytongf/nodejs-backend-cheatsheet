// 05 · Express routers, params, and query strings.
// Run: npx tsx examples/05-express-routes/index.ts
// Try:  curl http://localhost:4001/tasks
//       curl http://localhost:4001/tasks/42
//       curl "http://localhost:4001/tasks?done=true"

import express, { Router } from 'express';

const app = express();
app.use(express.json());

const tasks = Router();

tasks.get('/', (req, res) => {
  res.json({ done: req.query.done ?? 'all', items: ['write docs', 'ship API'] });
});

tasks.get('/:id', (req, res) => {
  res.json({ id: req.params.id, title: `Task ${req.params.id}` });
});

tasks.post('/', (req, res) => {
  res.status(201).json({ created: req.body });
});

app.use('/tasks', tasks);

app.listen(4001, () => console.log('Express routes on http://localhost:4001'));
