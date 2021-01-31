import fc from "fast-check";

import { hashTableDoubleHashFactory } from "../..";

import { commands, Model } from "./commands";

describe.each`
  name                            | factory
  ${"HashTable - Double Hashing"} | ${hashTableDoubleHashFactory}
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
