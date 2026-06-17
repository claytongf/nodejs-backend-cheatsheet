import { describe, it, expect } from '@jest/globals';
import { TtlCache } from '../shared/utils/cache.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('TtlCache', () => {
  it('returns a stored value before it expires', () => {
    const cache = new TtlCache<number>(1000);
    cache.set('a', 42);
    expect(cache.get('a')).toBe(42);
  });

  it('returns undefined for a missing key', () => {
    const cache = new TtlCache<number>(1000);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('expires entries after the TTL', async () => {
    const cache = new TtlCache<string>(10);
    cache.set('k', 'v');
    await sleep(25);
    expect(cache.get('k')).toBeUndefined();
  });

  it('invalidates a key on delete', () => {
    const cache = new TtlCache<string>(1000);
    cache.set('k', 'v');
    cache.delete('k');
    expect(cache.get('k')).toBeUndefined();
  });

  it('wrap() loads once on a miss, then serves from cache (cache-aside)', async () => {
    const cache = new TtlCache<number>(1000);
    let calls = 0;
    const loader = async () => {
      calls += 1;
      return 7;
    };

    expect(await cache.wrap('k', loader)).toBe(7); // miss -> loads
    expect(await cache.wrap('k', loader)).toBe(7); // hit -> cached
    expect(calls).toBe(1);
  });
});
