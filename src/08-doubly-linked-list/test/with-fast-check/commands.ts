import fc, { Command } from "fast-check";

import { DoublyLinkedList } from "../../types";

type DoublyLinkedListCommand = Command<any, DoublyLinkedList>;

export interface Model {
  [key: string]: any;
}

/**
 * AddCommand
 *
 * @implements {HashTableCommand}
 */
class AddCommand implements HashTableCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: HashTable) => {};

  toString = () => `add(${this.value})`;
}
const commands = [];

export { commands };
