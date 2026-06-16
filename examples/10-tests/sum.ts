// A tiny pure function to unit-test.
export function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
