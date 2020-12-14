import fc from "fast-check";

import { Stack } from "../";

export type Model = any[] & { id?: number };

type StackCommand = fc.Command<Model, Stack>;

class PushCommand implements StackCommand {
  constructor(readonly value: any) {}

  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Stack): void {
    r.push(this.value);
    m.push(this.value);
  }

  toString = () => `push(${this.value})`;
}

class PopCommand implements StackCommand {
  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Stack): void {
    const stackValue = r.pop();
    const modelValue = m.slice(-1)[0];

    m.pop();
    expect(stackValue).toEqual(modelValue);
  }

  toString = () => `pop`;
}

class SizeCommand implements StackCommand {
  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Stack): void {
    expect(r.size()).toBe(m.length);
  }

  toString = () => `size`;
}

const commands = [
  fc.string().map((v) => new PushCommand(v)),
  fc.constant(new PopCommand()),
  fc.constant(new SizeCommand()),
];

export { commands };
