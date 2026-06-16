// 01 · Node core — globals and built-in modules.
// Run: npx tsx examples/01-node-core/index.ts

import os from 'node:os';
import path from 'node:path';

// `process` gives you info about the running program.
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Current dir:', process.cwd());
console.log('A custom env var (PORT):', process.env.PORT ?? '(not set)');

// Core modules expose OS and filesystem helpers.
console.log('CPU cores:', os.cpus().length);
console.log('Joined path:', path.join('src', 'modules', 'tasks'));

// CLI arguments (try: npx tsx examples/01-node-core/index.ts hello world)
console.log('Args:', process.argv.slice(2));
