import { HashTable, HashTableKey, HashingFunction } from "../types";

const lengthHash: HashingFunction = (key) => {
  const { length } = String(key);

  return length;
};

const id = (key: HashTableKey) => key;

function hashTableDoubleHashFactory<T = any>(
  hashX = lengthHash,
  hashY = id
): HashTable<T> {
  const collection: Record<number, Record<HashTableKey, T>> = {};

  const add: HashTable["add"] = function add(key, value) {
    const primaryHash = hashX(key);
    const secondaryHash = hashY(key);

    if (!collection[primaryHash]) {
      collection[primaryHash] = {};
    }

    collection[primaryHash][secondaryHash] = value;
  };

  const remove: HashTable["remove"] = function remove(key) {
    const primaryHash = hashX(key);
    const secondaryHash = hashY(key);

    if (!collection[primaryHash]) {
      return;
    }

    delete collection[primaryHash][secondaryHash];

    // clean up
    if (Object.values(collection[primaryHash]).length === 0) {
      delete collection[primaryHash];
    }
  };

  const lookup: HashTable["lookup"] = function lookup(key) {
    const primaryHash = hashX(key);
    const secondaryHash = hashY(key);

    return collection[primaryHash]
      ? collection[primaryHash][secondaryHash]
      : undefined;
  };

  return { add, lookup, remove };
}

export { hashTableDoubleHashFactory };
