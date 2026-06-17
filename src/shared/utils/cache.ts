// A tiny, dependency-free in-memory cache with per-entry expiry (TTL).
//
// This demonstrates the cache-aside pattern (see docs/24-caching.md) without adding a
// dependency. In production you would back this with Redis so the cache is shared across
// processes and survives restarts — the `wrap`/`get`/`set`/`delete` shape stays the same.
//
// Limitations to understand (and discuss in interviews):
// - It is per-process: each instance/worker has its own copy (not shared).
// - It does not bound memory or evict LRU; a real cache (Redis) handles eviction.

interface CacheEntry<V> {
  value: V;
  expiresAt: number; // epoch ms after which the entry is stale
}

export class TtlCache<V> {
  private readonly store = new Map<string, CacheEntry<V>>();

  constructor(private readonly ttlMs: number) {}

  // Returns the cached value, or undefined if missing or expired.
  get(key: string): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key); // lazily evict on read
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: V): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  // Invalidate one key. Call this after a write so readers do not see stale data.
  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Cache-aside: return the cached value on a hit; otherwise run `loader`, cache it, return it.
  async wrap(key: string, loader: () => Promise<V>): Promise<V> {
    const hit = this.get(key);
    if (hit !== undefined) return hit;
    const value = await loader();
    this.set(key, value);
    return value;
  }
}
