// 10 · A unit test with Jest.
// Run from the repo root: npx jest examples/10-tests
import { sum } from './sum.js';

describe('sum', () => {
  it('adds an empty list to 0', () => {
    expect(sum([])).toBe(0);
  });

  it('adds numbers', () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  it('handles negatives', () => {
    expect(sum([5, -2, -3])).toBe(0);
  });
});
