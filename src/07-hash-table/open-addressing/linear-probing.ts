import { HashTable, HashTableKey, HashingFunction } from "../types";

type Entry<Value = any> = [HashTableKey, Value];

function hashTableLinearProbingFactory<T = any>(): HashTable<T> {
  let collection: Array<Entry<T> | undefined> = [];
  let size = 10;
  let length = 0;

  function hash(key: HashTableKey, offset: number) {
    return (String(key).length + offset) % size;
  }

  function resize() {
    const tmpCollection = collection;
    const oldSize = size;
    size = size * 2;
    collection = [];

    for (let i = 0; i < oldSize; i++) {
      const indexedValue = tmpCollection[i];
      const [key, value] = deconstruct(indexedValue);

      if (key) {
        add(key, value);
      }
    }
  }

  function deconstruct(indexedValue: Entry<T> | undefined) {
    const [key, value] = indexedValue ? indexedValue : [];

    return [key, value] as Entry<T>;
  }

  const add: HashTable["add"] = function add(key, value) {
    let count = 0;
    let added = false;

    while (count < size) {
      const currHashedKey = hash(key, count);
      const valueAtHashedKey = collection[currHashedKey];
      const [keyAtIndex, valueAtIndex] = deconstruct(valueAtHashedKey);

      if (valueAtIndex === undefined || keyAtIndex === key) {
        const valueToInsert: Entry<T> = [key, value];
        collection[currHashedKey] = valueToInsert;
        length++;
        added = true;
        break;
      }

      count++;
    }

    if (!added) {
      resize();
      add(key, value);
    }

    if (length >= size * 0.6) {
      resize();
    }
  };

  const remove: HashTable["remove"] = function remove(key) {
    let count = 0;

    while (count < size) {
      const currHashedKey = hash(key, count);
      const valueAtHashedKey = collection[currHashedKey];
      const [keyAtIndex] = deconstruct(valueAtHashedKey);

      if (valueAtHashedKey && keyAtIndex === key) {
        collection[currHashedKey] = undefined;
        length--;
        break;
      }

      count++;
    }
  };

  const lookup: HashTable["lookup"] = function lookup(key) {
    const { length: arrLength } = collection;
    let result;

    for (let i = 0; i < arrLength; i++) {
      const currHashedKey = hash(key, i);
      const valueAtHashedKey = collection[currHashedKey];
      const [keyAtIndex, valueAtIndex] = deconstruct(valueAtHashedKey);

      if (typeof valueAtIndex === "string" && keyAtIndex === key) {
        result = valueAtIndex;
        break;
      }
    }

    return result;
  };

  return { add, lookup, remove };
}

export { hashTableLinearProbingFactory };
