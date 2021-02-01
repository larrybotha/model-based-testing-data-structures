import { linkedListFactory, LinkedList } from "@src/06-linked-list";

import { HashingFunction, HashTable, HashTableKey } from "../types";

const hashingFunction: HashingFunction = (key) => {
  const mod = 7;

  return typeof key === "number" ? key % mod : key.length % mod;
};

function hashTableLinkedListFactory<Value = any>(): HashTable<Value> {
  let collection: Record<number, LinkedList<string>>;

  const add: HashTable<Value>["add"] = function add(key, value) {
    const hash = hashingFunction(key);

    if (!collection[hash]) {
      collection[hash] = linkedListFactory();
    }

    const linkedList = collection[hash];

    linkedList.add(JSON.stringify([key, value]));
  };

  function remove(key: string) {
    const hash = hashingFunction(key);
    const linkedList = collection[hash];

    if (linkedList) {
    }
  }

  function lookup(key: string) {
    return undefined;
  }

  return {
    add,
    remove,
    lookup,
  };
}

export { hashTableLinkedListFactory };
