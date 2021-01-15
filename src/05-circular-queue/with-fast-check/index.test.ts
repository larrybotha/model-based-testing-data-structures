import fc from "fast-check";

import { circularQueueFactory } from "..";

import { commands } from "./commands";

describe("circular queue with fast-check", () => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const queue = circularQueueFactory();
        const sut = () => ({ model: {}, real: queue });

        fc.modelRun(sut, cmds);
      })
    );
  });
});
