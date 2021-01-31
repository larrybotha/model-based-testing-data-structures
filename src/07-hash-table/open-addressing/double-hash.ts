import { HashTable } from "../types";

type HashingFunction = (key: string) => string | number;

const naiveHash: HashingFunction = (key: string) => {
  const xs = key.split("").map((s) => s.charCodeAt(0));

  return xs.reduce((acc, x) => acc + x, 0);
};

const id = (key: string) => key;

function hashTableDoubleHashFactory<T = any>(
  primaryHashingFunction: HashingFunction = naiveHash,
  secondaryHashingFunction: HashingFunction = id
): HashTable<T> {
  const collection: Record<number | string, Record<number | string, T>> = {};

  function add(key: string, value: T) {
    const primaryHash = primaryHashingFunction(key);
    const secondaryHash = secondaryHashingFunction(key);

    if (!collection[primaryHash]) {
      collection[primaryHash] = {};
    }

    collection[primaryHash][secondaryHash] = value;
  }

  function remove(key: string) {
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
  }

  function lookup(key: string) {
    const primaryHash = primaryHashingFunction(key);
    const secondaryHash = secondaryHashingFunction(key);

    return collection[primaryHash]
      ? collection[primaryHash][secondaryHash]
      : undefined;
  }

  return { add, lookup, remove };
}

export { hashTableDoubleHashFactory };
