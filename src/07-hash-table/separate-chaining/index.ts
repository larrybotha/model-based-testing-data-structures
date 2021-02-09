import { linkedListFactory, LinkedList } from "@src/06-linked-list";

import { HashingFunction, HashTable, HashTableKey } from "../types";

const hashingFunction: HashingFunction = (key) => {
  const mod = 7;

  return typeof key === "number" ? key % mod : key.length % mod;
};

function hashTableLinkedListFactory<Value = any>(): HashTable<Value> {
  let collection: Record<number, LinkedList<string>> = {};

  const add: HashTable<Value>["add"] = function add(key, value) {
    const hash = hashingFunction(key);

    if (!collection[hash]) {
      collection[hash] = linkedListFactory();
    }

    const linkedList = collection[hash];
    const valueToAdd = JSON.stringify([key, value]);
    const index = linkedList.indexOf(valueToAdd);

    if (index > -1) {
      linkedList.removeAt(index);
    }

    linkedList.add(valueToAdd);
  };

  function remove(key: string) {
    const hash = hashingFunction(key);
    const linkedList = collection[hash];

    if (!linkedList) {
      return;
    }

    let index = 0;
    let found = false;

    while (!found && linkedList.elementAt(index) !== null) {
      const element = linkedList.elementAt(index);

      if (element && element.substr(1).startsWith(`${JSON.stringify(key)}`)) {
        found = true;
      } else {
        index++;
      }
    }

    if (found) {
      linkedList.removeAt(index);
    }

    if (linkedList.isEmpty()) {
      delete collection[hash];
    }
  }

  function lookup(key: string) {
    const hash = hashingFunction(key);
    const linkedList = collection[hash];

    if (!linkedList) {
      return undefined;
    }

    let index = 0;
    let found = false;
    let result = undefined;

    while (!found && linkedList.elementAt(index) !== null) {
      const element = linkedList.elementAt(index);
      const [, value] = element ? JSON.parse(element) : null;

      if (element && element.substr(1).startsWith(`${JSON.stringify(key)}`)) {
        found = true;
        result = value;
      } else {
        index++;
      }
    }

    return result;
  }

  return {
    add,
    remove,
    lookup,
  };
}

export { hashTableLinkedListFactory };
