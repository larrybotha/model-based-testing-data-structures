import b from "benny";
import fc from "fast-check";

import {
  CircularQueueFactory,
  circularQueueArrayFactory,
  circularQueueFactory,
  circularQueueObjectFactory,
} from "./";
import { commands } from "./with-fast-check/commands";

const arbQueueSize = fc.integer({ min: 0, max: 100 });

const size = fc.sample(arbQueueSize, 1)[0];
const queueCommands: any = fc.sample(fc.commands(commands, 100), 1)[0];

function executeCommand(entity: any, cmdWrapper: any) {
  const { name } = cmdWrapper.constructor.name;

  switch (name) {
    case "EnqueueCommand": {
      entity.enqueue(cmdWrapper.value);
      break;
    }
    case "SizeCommand": {
      entity.size();
    }
    case "DequeueCommand": {
      entity.dequeue();
    }
  }
}

function runInstance(
  factory: CircularQueueFactory,
  size: number,
  commands: any[]
) {
  const queue = factory(size);

  commands.map((cmd: any) => executeCommand(queue, cmd));
}

b.suite(
  "Circular Queue",

  b.add("Map implementation", () => {
    runInstance(circularQueueFactory, size, queueCommands.commands);
  }),

  b.add("Array implementation", () => {
    runInstance(circularQueueArrayFactory, size, queueCommands.commands);
  }),

  b.add("Object implementation", () => {
    runInstance(circularQueueObjectFactory, size, queueCommands.commands);
  }),

  b.cycle(),
  b.complete()
);
