import fc, { Command } from "fast-check";

import { BinarySearchTree } from "../../types";

type BinarySearchTreeCommand = Command<any, BinarySearchTree>;

export type Model = any[];
/**
 * IsPresentCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class IsPresentCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const isPresentInModel = m.indexOf(this.value) > -1;
    const isPresent = r.isPresent(this.value);

    expect(isPresent).toBe(isPresentInModel);
  };

  toString = () => `isPresent(${this.value})`;
}

/**
 * AddCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class AddCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const mValue = m.find((v) => v > this.value);
    const index = mValue ? m.indexOf(mValue) : 0;
    const ms = m.slice(0, index).concat(this.value).concat(m.slice(index));

    for (let i = 0; i < ms.length; i++) {
      m[i] = ms[i];
    }

    r.add(this.value);
  };

  toString = () => `add(${this.value})`;
}

/**
 * RemoveCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class RemoveCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const index = m.indexOf(this.value);

    if (index > -1) {
      const ms = m.slice(0, index).concat(m.slice(index + 1));

      for (let i = 0; i < ms.length; i++) {
        m[i] = ms[i];
      }
    }

    r.remove(this.value);
  };

  toString = () => `remove(${this.value})`;
}

const values = fc.sample(fc.integer());
const arbIndex = fc.integer({ min: 0, max: values.length - 1 });

const commands = [
  arbIndex.map((index) => new AddCommand(values[index])),
  //arbIndex.map((index) => new RemoveCommand(values[index])),
  arbIndex.map((index) => new IsPresentCommand(values[index])),
];

export { commands };
