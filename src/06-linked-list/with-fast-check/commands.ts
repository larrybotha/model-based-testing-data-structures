import fc, { Command } from "fast-check";

import { LinkedList } from "..";

type LinkedListCommand = Command<any, LinkedList>;

export type Model = any[];

/**
 * AddCommand
 *
 * @implements {LinkedListCommand}
 */
class AddCommand implements LinkedListCommand {
  constructor(private value: any) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    m.push(this.value);
    r.add(this.value);
  };

  toString = () => `add(${this.value})`;
}

/**
 * RemoveCommand
 *
 * @implements {LinkedListCommand}
 */
class RemoveCommand implements LinkedListCommand {
  constructor(private value: any) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    const mIndex = m.indexOf(this.value);

    if (mIndex > -1) {
      for (let i = mIndex + 1; i < m.length; i++) {
        m[i - 1] = m[i];
      }

      m.pop();
    }

    r.remove(this.value);
  };

  toString = () => `remove(${this.value})`;
}

/**
 * IndexOfCommand.
 *
 * @implements {LinkedListCommand}
 */
class IndexOfCommand implements LinkedListCommand {
  constructor(private value: any) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    const mIndex = m.indexOf(this.value);
    const rIndex = r.indexOf(this.value);

    expect(rIndex).toBe(mIndex);
  };

  toString = () => `indexOf(${this.value})`;
}

/**
 * IsEmptyCommand.
 *
 * @implements {LinkedListCommand}
 */
class IsEmptyCommand implements LinkedListCommand {
  constructor() {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    expect(r.isEmpty()).toBe(m.length === 0);
  };

  toString = () => `isEmpty()`;
}

/**
 * ElementAtCommand.
 *
 * @implements {LinkedListCommand}
 */
class ElementAtCommand implements LinkedListCommand {
  constructor(private index: number) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    const mValue = m[this.index] || null;
    const rValue = r.elementAt(this.index);

    expect(rValue).toBe(mValue);
  };

  toString = () => `elementAt(${this.index})`;
}

/**
 * RemoveAtCommand.
 *
 * @implements {LinkedListCommand}
 */
class RemoveAtCommand implements LinkedListCommand {
  constructor(private index: number) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {
    if (this.index > -1 && m.length > this.index) {
      for (let i = this.index + 1; i < m.length; i++) {
        m[i - 1] = m[i];
      }

      m.pop();
    }

    r.removeAt(this.index);
  };

  toString = () => `removeAt(${this.index})`;
}

const tuples = fc.sample(fc.tuple(fc.integer({ min: 0 }), fc.json()));
const arbTupleIndex = fc.integer({ min: 0, max: tuples.length - 1 });

const commands = [
  arbTupleIndex.map((index) => {
    const [, value] = tuples[index];

    return new AddCommand(value);
  }),

  arbTupleIndex.map((index) => {
    const [, value] = tuples[index];

    return new RemoveCommand(value);
  }),

  arbTupleIndex.map((index) => {
    const [, value] = tuples[index];

    return new IndexOfCommand(value);
  }),

  arbTupleIndex.map((index) => {
    const [i] = tuples[index];

    return new ElementAtCommand(i);
  }),

  arbTupleIndex.map((index) => {
    const [i] = tuples[index];

    return new RemoveAtCommand(i);
  }),

  fc.constant(new IsEmptyCommand()),
];

export { commands };
