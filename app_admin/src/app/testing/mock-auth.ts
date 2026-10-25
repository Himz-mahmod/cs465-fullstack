// Test helpers: build a fake JWT and an in-memory replacement for localStorage

export function makeToken(secondsFromNow = 3600, name = 'Test Admin', email = 'admin@travlr.com'): string {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '');
  const exp = Math.floor(Date.now() / 1000) + secondsFromNow;
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ _id: 'u1', email, name, exp })}.signature`;
}

export class FakeStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}

export function loggedInStorage(): FakeStorage {
  const s = new FakeStorage();
  s.setItem('travlr-token', makeToken());
  return s;
}
