// 03 · Async/await, promises, and event-loop ordering.
// Run: npx tsx examples/03-async-await/index.ts

function wait(ms: number, label: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(label), ms));
}

async function main() {
  // Event-loop ordering demo:
  console.log('1: sync start');
  setTimeout(() => console.log('5: macrotask (timer)'), 0);
  Promise.resolve().then(() => console.log('3: microtask'));
  console.log('2: sync end');

  // Sequential vs parallel:
  console.time('sequential');
  await wait(100, 'a');
  await wait(100, 'b');
  console.timeEnd('sequential'); // ~200ms

  console.time('parallel');
  const results = await Promise.all([wait(100, 'a'), wait(100, 'b')]);
  console.timeEnd('parallel'); // ~100ms
  console.log('4: parallel results', results);
}

main();
