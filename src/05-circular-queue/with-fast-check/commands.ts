import fc, { Command } from "fast-check";

import { CircularQueue } from "..";

type CircularQueueCommand = Command<any, CircularQueue>;

interface Model {
  read: number;
  values: any[];
  write: number;
}

class EnqueueCommand implements CircularQueueCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (model: any, real: CircularQueue) => {
    real.enqueue(this.value);
  };
}

const commands = [];

export { commands };
