import fc, { Command } from "fast-check";

import { DoublyLinkedList } from "../../types";

type DoublyLinkedListCommand = Command<any, DoublyLinkedList>;

export type Model = any[];

/**
 * AddCommand
 *
 * @implements {DoublyLinkedListCommand}
 */
class AddCommand implements DoublyLinkedListCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: DoublyLinkedList) => {
    m.push(this.value);

    r.add(this.value);
  };

  toString = () => `add(${this.value})`;
}

/**
 * RemoveCommand
 *
 * @implements {DoublyLinkedListCommand}
 */
class RemoveCommand implements DoublyLinkedListCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: DoublyLinkedList) => {
    const index = m.indexOf(this.value);

    if (index > -1) {
      const tmp = m.filter((_, i) => i !== index);

      for (let i = 0; i < m.length; i++) {
        m[i] = tmp[i];
      }

      m.pop();
    }

    r.remove(this.value);
  };

  toString = () => `remove(${this.value})`;
}

/**
 * ElementAtCommand
 *
 * @implements {DoublyLinkedListCommand}
 */
class ElementAtCommand implements DoublyLinkedListCommand {
  constructor(public index: number) {}

  check = () => true;

  run = (m: Model, r: DoublyLinkedList) => {
    const modelValue = this.index >= m.length ? null : m[this.index];
    const realValue = r.elementAt(this.index);

    expect(realValue).toEqual(modelValue);
  };

  toString = () => `elementAt(${this.index})`;
}

/**
 * FindCommand
 *
 * @implements {DoublyLinkedListCommand}
 */
class FindCommand implements DoublyLinkedListCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: DoublyLinkedList) => {
    const mIndex = m.indexOf(this.value);
    const node = r.find(this.value);

    // if index is -1, expect node not to exist
    if (mIndex === -1) {
      expect(node).toBe(null);
    }

    // if the first element, we're at the head, and the head has no previous node
    if (mIndex === 0) {
      expect(node?.previous).toBe(null);
    }

    // if the last element, we're at the tail, and the tail has no next node
    if (mIndex > -1 && mIndex === m.length - 1) {
      expect(node?.next).toBe(null);
    }

    // if there is an index, then the node should exist
    if (mIndex > -1) {
      expect(node).not.toBe(null);
    }

    // if there is a next element in the array, then there should be a next node
    if (mIndex > -1 && m[mIndex + 1]) {
      const mValue = m[mIndex + 1];
      const nextNode = node ? node.next : null;
      expect(nextNode).not.toBe(null);

      if (nextNode) {
        expect(nextNode.data).toEqual(mValue);
      }
    }

    // if the index is greater than 1, then the node should have a previous node
    if (mIndex > 1) {
      const mValue = m[mIndex - 1];
      const prevNode = node ? node.previous : null;
      expect(prevNode).not.toBe(null);

      if (prevNode) {
        expect(prevNode.data).toEqual(mValue);
      }
    }
  };

  toString = () => `find(${this.value})`;
}

const values = fc.sample(fc.jsonObject(), 100);
const arbIndex = fc.integer({ min: 0, max: values.length });

const commands = [
  arbIndex.map((index) => new AddCommand(values[index])),
  arbIndex.map((index) => new RemoveCommand(values[index])),
  arbIndex.map((index) => new ElementAtCommand(index)),
  arbIndex.map((index) => new FindCommand(values[index])),
];

export { commands };
