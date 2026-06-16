// 02 · Modules — importing named and default exports.
// Run: npx tsx examples/02-modules/index.ts

import multiply, { add, PI } from './math.js'; // note the .js extension in ESM

console.log('add(2, 3) =', add(2, 3));
console.log('multiply(2, 3) =', multiply(2, 3));
console.log('PI =', PI);
