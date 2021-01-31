export interface HashTable<T = any> {
  add(key: string, value: T): void;
  remove(key: string): void;
  lookup(key: string): T | undefined;
}

export interface HashingFunction<Key = string | number> {
  (key: Key): number | string;
}
