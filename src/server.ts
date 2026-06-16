// The runtime entry point: loads environment variables and starts the HTTP server.
// Environment validation and graceful shutdown are added in a later phase.
import 'dotenv/config';
import { app } from './app.js';

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console -- replaced by structured logging in a later phase
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
