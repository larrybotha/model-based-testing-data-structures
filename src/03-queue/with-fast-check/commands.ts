import fc from "fast-check";

type Model = any[];
type Queue = any;

type QueueCommand = fc.Command<Model, Queue>;

class EnqueueCommand implements QueueCommand {
  constructor(public readonly value: any) {}

  check = () => true;

  run(m: Model, r: Queue) {
    r.enqueue(this.value);
    m.push(this.value);
  }

  toString = () => `enqueue(${this.value})`;
}

class DequeueCommand implements QueueCommand {
  check = () => true;

  run(m: Model, r: Queue) {
    const qValue = r.dequeue();
    const mValue = m.shift();

    expect(qValue).toBe(mValue);
  }

  toString = () => `dequeue`;
}

class FrontCommand implements QueueCommand {
  check = () => true;

  run(m: Model, r: Queue) {
    const qValue = r.front();
    const mValue = m[0];

    expect(qValue).toBe(mValue);
  }

  toString = () => `front`;
}

class SizeCommand implements QueueCommand {
  check = () => true;

  run(m: Model, r: Queue) {
    expect(r.size()).toBe(m.length);
  }

  toString = () => `size`;
}

class IsEmptyCommand implements QueueCommand {
  check = () => true;

  run(m: Model, r: Queue) {
    expect(r.isEmpty()).toBe(m.length === 0);
  }

  toString = () => `isEmpty`;
}

const commands = [
  fc.constant(new DequeueCommand()),
  fc.constant(new FrontCommand()),
  fc.constant(new IsEmptyCommand()),
  fc.constant(new SizeCommand()),
  fc.json().map((v) => new EnqueueCommand(v)),
];

export { commands };
