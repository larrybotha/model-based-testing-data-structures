import fc, { Command } from "fast-check";

import { PriorityQueue, PriorityQueueValue } from "..";

type PriorityQueueCommand = Command<any, PriorityQueue>;
type Model = { [key: string]: any };

function getModelSize(model: Model) {
  return Object.values(model).reduce((acc, values) => acc + values.length, 0);
}

function getModelKey(model: Model) {
  const modelKeys = Object.entries(model)
    .filter(([, xs]) => xs.length > 0)
    .map(([key]) => parseInt(key, 10));

  return modelKeys[0];
}

class EnqueueCommand implements PriorityQueueCommand {
  constructor(public readonly value: PriorityQueueValue) {}

  check = () => true;

  run = (model: Model, real: PriorityQueue) => {
    const [x, priority] = this.value;

    // update model
    if (!Array.isArray(model[priority])) {
      model[priority] = [];
    }

    Object.keys(model).forEach((key) => {
      if (key === `${priority}`) {
        model[priority].push(x);
      }
    });

    // update real value
    real.enqueue(this.value);
  };

  toString = () => `enqueue(${this.value})`;
}

class DequeueCommand implements PriorityQueueCommand {
  check = () => true;

  run = (model: Model, real: PriorityQueue) => {
    // update the model
    const modelKey = getModelKey(model);
    const modelValue =
      model[modelKey] && model[modelKey].length > 0
        ? model[modelKey].shift()
        : undefined;

    // update the real value
    const realValue = real.dequeue();

    expect(realValue).toBe(modelValue);
  };

  toString = () => `dequeue`;
}

class SizeCommand implements PriorityQueueCommand {
  check = () => true;

  run = (model: Model, real: PriorityQueue) => {
    const modelSize = getModelSize(model);

    expect(real.size()).toBe(modelSize);
  };

  toString = () => `size`;
}

class IsEmptyCommand implements PriorityQueueCommand {
  check = () => true;

  run = (model: Model, real: PriorityQueue) => {
    const modelSize = getModelSize(model);

    expect(real.isEmpty()).toBe(modelSize === 0);
  };

  toString = () => `isEmpty`;
}

class FrontCommand implements PriorityQueueCommand {
  check = () => true;

  run = (model: Model, real: PriorityQueue) => {
    const modelKey = getModelKey(model);
    const modelValue = modelKey ? model[modelKey][0] : undefined;

    expect(real.front()).toBe(modelValue);
  };

  toString = () => `front`;
}

const arbPriorityValue = () => fc.tuple(fc.json(), fc.integer({ min: 0 }));

const commands = [
  arbPriorityValue().map((v) => new EnqueueCommand(v)),
  fc.constant(new DequeueCommand()),
  fc.constant(new FrontCommand()),
  fc.constant(new IsEmptyCommand()),
  fc.constant(new SizeCommand()),
];

export { commands };
