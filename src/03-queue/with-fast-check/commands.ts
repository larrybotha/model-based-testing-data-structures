import fc from "fast-check";

type Model = any[];
type Queue = any;

type QueueCommand = fc.Command<Model, Queue>;

class EnqueueCommand implements QueueCommand {
  constructor(public readonly value: any) {}

  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Queue) {
    r.enqueue(this.value);
    m.push(this.value);
  }

  toString = () => `enqueue(${this.value})`;
}

class DequeueCommand implements QueueCommand {
  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Queue) {
    const qValue = r.dequeue();
    const mValue = m.unshift();

    expect(qValue).toBe(mValue);
  }

  toString = () => `dequeue`;
}

const commands = [
  fc.json().map((v) => new EnqueueCommand(v)),
  fc.constant(new DequeueCommand()),
];

export { commands };
