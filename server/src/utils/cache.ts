const store = new Map<string, { data: unknown; expiresAt: number }>();

const DEFAULT_TTL = 10 * 60 * 1000;

export function get<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function del(key: string): void {
  store.delete(key);
}

export function has(key: string): boolean {
  return get(key) !== undefined;
}
