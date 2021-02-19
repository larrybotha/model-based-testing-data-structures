import { HashTable, HashTableKey, HashingFunction } from "../types";

const lengthHash: HashingFunction = (key) => {
  const { length } = String(key);

  return length;
};

const id = (key: HashTableKey) => key;

function hashTableDoubleHashFactory<T = any>(
  primaryHashingFunction = naiveHash,
  secondaryHashingFunction = id
): HashTable<T> {
  const collection: Record<number, Record<HashTableKey, T>> = {};

  const add: HashTable["add"] = function add(key, value) {
    const primaryHash = primaryHashingFunction(key);
    const secondaryHash = secondaryHashingFunction(key);

    if (!collection[primaryHash]) {
      collection[primaryHash] = {};
    }

    collection[primaryHash][secondaryHash] = value;
  };

  const remove: HashTable["remove"] = function remove(key) {
    const primaryHash = primaryHashingFunction(key);
    const secondaryHash = secondaryHashingFunction(key);

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
    const primaryHash = primaryHashingFunction(key);
    const secondaryHash = secondaryHashingFunction(key);

    return collection[primaryHash]
      ? collection[primaryHash][secondaryHash]
      : undefined;
  };

  return { add, lookup, remove };
}

export { hashTableDoubleHashFactory };
