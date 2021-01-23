import fc from "fast-check";

import { hashTableFactory } from "..";

import { commands, Model } from "./commands";

describe.each`
  name           | factory
  ${"HashTable"} | ${hashTableFactory}
`("-> $name with fast-check", ({ factory, name }) => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const hashTable = factory();
        const model: Model = {};
        const sut = () => ({ model, real: hashTable });

        fc.modelRun(sut, cmds);
      })
    );
  });
});
