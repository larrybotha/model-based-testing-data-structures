import { HashTable, HashTableKey, HashingFunction } from "../types";

function hashTableLinearProbingFactory<T = any>(): HashTable<T> {
  let collection: Array<string | undefined> = [];
  let size = 10;
  let length = 0;

  const hash: HashingFunction = function hash(key) {
    return String(key).length % size;
  };

  function resize() {
    const tmpCollection = collection;
    const oldSize = size;
    size = size * 2;
    collection = [];

    for (let i = 0; i < oldSize; i++) {
      const [key, value] = decode(tmpCollection[i]);

      if (value) {
        add(key, value);
      }
    }
  }

  function encode(key: HashTableKey, value: T) {
    const stringifiedValue = JSON.stringify(value);
    const result = `|${key}|:${stringifiedValue}`;
    console.log("encoded", result);
    console.log("decoded", decode(result));

    return result;
  }

  function decode(encodedValue?: string) {
    const [decodedKey, stringifiedValue] = encodedValue
      ? encodedValue.split(/^$.+$:/)
      : [];
    const value = stringifiedValue ? JSON.parse(stringifiedValue) : undefined;

    return [
      typeof decodedKey === "string" ? decodedKey.slice(-1) : decodedKey,
      value,
    ];
  }

  const add: HashTable["add"] = function add(key, value) {
    const hashedKey = hash(key);
    let count = 0;

    while (count < size) {
      const currHashedKey = hashedKey + count;
      const valueAtHashedKey = collection[currHashedKey];
      const [decodedKey] = decode(valueAtHashedKey);

      if (valueAtHashedKey === undefined || decodedKey === key) {
        const encodedValue = encode(key, value);
        collection[currHashedKey] = encodedValue;
        length++;
        break;
      }

      count++;
    }

    if (length >= size * 0.6) {
      resize();
    }
  };

  const remove: HashTable["remove"] = function remove(key) {
    const hashedKey = hash(key);
    let count = 0;

    while (count < size) {
      const currHashedKey = hashedKey + count;
      const valueAtHashedKey = collection[currHashedKey];
      const [decodedKey] = decode(valueAtHashedKey);

      if (valueAtHashedKey && decodedKey === key) {
        collection[currHashedKey] = undefined;
        length--;
        break;
      }

      count++;
    }
  };

  const lookup: HashTable["lookup"] = function lookup(key) {
    const hashedKey = hash(key);
    let count = 0;
    let result;

    for (let i = hashedKey; i < size; i++) {
      const currHashedKey = hashedKey + count;
      const valueAtHashedKey = collection[currHashedKey];
      const [decodedKey] = decode(valueAtHashedKey);

      if (valueAtHashedKey && decodedKey === key) {
        result = valueAtHashedKey;
        break;
      }
    }

    return result;
  };

  return { add, lookup, remove };
}

export { hashTableLinearProbingFactory };
