import fc, { Command } from "fast-check";

import { LinkedList } from "..";

type LinkedListCommand = Command<any, LinkedList>;

export type Model = amy[];

/**
 * AddCommand
 *
 * @implements {LinkedListCommand}
 */
class AddCommand implements LinkedListCommand {
  constructor(private value: any) {}

  check = () => true;

  run = (m: Model, r: LinkedList) => {};

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

  run = (m: Model, r: LinkedList) => {};

  toString = () => `remove(${this.value})`;
}

const commands = [];

export { commands };
