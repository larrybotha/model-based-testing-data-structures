import * as bm from "benchmark";
import fc from "fast-check";

import { circularQueueFactory, circularQueueObjectFactory } from "./";
import { commands } from "./with-fast-check/commands";

const arbQueueSize = fc.integer({ min: 0, max: 100 });

const size = fc.sample(arbQueueSize, 1)[0];
const queueCommands = fc.sample(fc.commands(commands, 100), 1)[0];

const suite = new bm.Suite();

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

suite
  .add("circular queue - map implementation", () => {
    const queue = circularQueueFactory(size);

    (queueCommands as any).commands.map((cmd: any) =>
      executeCommand(queue, cmd)
    );
  })

  .add("circular queue - object implementation", () => {
    const queue = circularQueueObjectFactory(size);

    (queueCommands as any).commands.map((cmd: any) =>
      executeCommand(queue, cmd)
    );
  });

suite
  .on("cycle", (event: any) => {
    console.log(String(event.target));
  })
  .on("complete", () => {
    console.log(`Fastest is ${suite.filter("fastest").map("name")}`);
  })
  .run();
