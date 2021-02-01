export type HashTableKey = string | number;

export interface HashTable<Value = any> {
  add(key: HashTableKey, value: Value): void;
  remove(key: HashTableKey): void;
  lookup(key: HashTableKey): Value | undefined;
}

export interface HashingFunction {
  (key: HashTableKey): number;
}
