import fc from "fast-check";

import { queueFactory } from "../";

import { commands } from "./commands";

describe("queue with fast-check", () => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const queue = queueFactory();
        const sut = () => ({ model: [], real: queue });

        fc.modelRun(sut, cmds);
      })
    );
  });
});
