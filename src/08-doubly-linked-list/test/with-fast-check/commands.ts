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

const values = fc.sample(fc.jsonObject(), 100);
const arbIndex = fc.integer({ min: 0, max: values.length });

const commands = [
  arbIndex.map((index) => new AddCommand(values[index])),
  arbIndex.map((index) => new RemoveCommand(values[index])),
  arbIndex.map((index) => new ElementAtCommand(index)),
];

export { commands };
