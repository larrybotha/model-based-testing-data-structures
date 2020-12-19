import fc from "fast-check";

type Model = any[];
type Queue = any;

type QueueCommand = fc.Command<Model, Queue>;

class PushCommand implements QueueCommand {
  constructor(public readonly value: any) {}

  check = (m: Readonly<Model>) => true;

  run(m: Model, r: Queue) {
    r.push(this.value);
    m.push(this.value);
  }

  toString = () => `push(${this.value})`;
}

const commands = [fc.json().map((v) => new PushCommand(v))];

export { commands };
