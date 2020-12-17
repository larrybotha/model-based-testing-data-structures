import fc from "fast-check";

import { stackFactory } from "./";

import { commands } from "./test-commands";

describe("stack with fast-check", () => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const stack = stackFactory();
        const s = () => ({ model: [], real: stack });

        fc.modelRun(s, cmds);
      })
    );
  });
});
