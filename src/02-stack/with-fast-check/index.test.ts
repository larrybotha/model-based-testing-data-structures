import fc from "fast-check";

import { stackFactory } from "../";

import { commands } from "./commands";

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

  test("-> always reads from top of stack", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0 }), fc.array(fc.json()), (size, xs) => {
        const stack = stackFactory();
        const boundXs = xs.slice(0, size);

        boundXs.map((x) => stack.push(x));
        boundXs
          .slice()
          .reverse()
          .map((x) => {
            expect(stack.pop()).toEqual(x);
          });

        expect(stack.size()).toEqual(0);
      })
    );
  });
});
