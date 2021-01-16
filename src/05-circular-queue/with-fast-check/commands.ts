import fc, { Command } from "fast-check";

import { CircularQueue } from "..";

type CircularQueueCommand = Command<any, CircularQueue>;

export interface Model {
  values: any[];
  writes: number;
  size: number;
}

/**
 * EnqueueCommand.
 *
 * If the number of unread writes is less than the size of the queue, appends the
 * value to the end of the queue, else returns null
 *
 * @implements {CircularQueueCommand}
 */
class EnqueueCommand implements CircularQueueCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (model: Model, real: CircularQueue) => {
    let modelValue = null;

    if (model.writes < model.size) {
      model.values.push(this.value);
      model.writes++;
      modelValue = this.value;
    }

    const realValue = real.enqueue(this.value);

    expect(realValue).toEqual(modelValue);
  };

  toString = () => `enqueue(${this.value})`;
}

/**
 * DequeueCommand.
 *
 * If there have been any writes, reads first value in queue, else returns null
 *
 * @implements {CircularQueueCommand}
 */
class DequeueCommand implements CircularQueueCommand {
  check = () => true;

  run = (model: Model, real: CircularQueue) => {
    let modelValue = null;

    if (model.writes > 0) {
      modelValue = model.values.shift();
      model.writes--;
    }

    const realValue = real.dequeue();

    expect(realValue).toEqual(modelValue);
  };

  toString = () => `dequeue`;
}

const commands = [
  fc.json().map((value) => new EnqueueCommand(value)),
  fc.constant(new DequeueCommand()),
];

export { commands };
