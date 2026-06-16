// A module that exports values. ES Modules use `export` / `import`.
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

// A default export (one per module).
export default function multiply(a: number, b: number): number {
  return a * b;
}
