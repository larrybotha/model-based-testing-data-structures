import fc from "fast-check";

import { priorityQueueFactory } from "..";

import { commands } from "./commands";

describe("priority queue with fast-check", () => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const queue = priorityQueueFactory();
        const sut = () => ({ model: {}, real: queue });

        fc.modelRun(sut, cmds);
      })
    );
  });
});
