import fc, { Command } from "fast-check";

import { HashTable } from "..";

type HashTableCommand = Command<any, HashTable>;

export interface Model {
  [key: string]: any;
}

/**
 * AddCommand
 *
 * @implements {HashTableCommand}
 */
class AddCommand implements HashTableCommand {
  constructor(public key: string, public value: any) {}

  check = () => true;

  run = (m: Model, r: HashTable) => {
    m[this.key] = this.value;

    r.add(this.key, this.value);
  };

  toString = () => `add(${this.key}, ${this.value})`;
}

/**
 * RemoveCommand
 *
 * @implements {HashTableCommand}
 */
class RemoveCommand implements HashTableCommand {
  constructor(private key: string) {}

  check = () => true;

  run = (m: Model, r: HashTable) => {
    delete m[this.key];

    r.remove(this.key);
  };

  toString = () => `remove(${this.key})`;
}

/**
 * LookupCommand
 *
 * @implements {HashTableCommand}
 */
class LookupCommand implements HashTableCommand {
  constructor(private key: string) {}

  check = () => true;

  run = (m: Model, r: HashTable) => {
    expect(r.lookup(this.key)).toEqual(m[this.key]);
  };

  toString = () => `lookup(${this.key})`;
}

const tuples = fc.sample(
  fc.tuple(
    fc
      .json()
      .map((v) => String(v))
      .filter((s) => s.length > 0),
    fc.json()
  )
);
const arbTuplesIndex = fc.integer({ min: 0, max: tuples.length - 1 });

const commands = [
  arbTuplesIndex.map((index) => {
    const [k, v] = tuples[index];

    return new AddCommand(k, v);
  }),

  arbTuplesIndex.map((index) => {
    const [k] = tuples[index];

    return new RemoveCommand(k);
  }),

  arbTuplesIndex.map((index) => {
    const [k] = tuples[index];

    return new LookupCommand(k);
  }),
];

export { commands };
