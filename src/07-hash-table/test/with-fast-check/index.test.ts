import fc from "fast-check";

import { hashTableDoubleHashFactory, hashTableLinkedListFactory } from "../..";

import { commands, Model } from "./commands";

describe.each`
  name                                             | factory
  ${"HashTable - Open Addressing: Double Hashing"} | ${hashTableDoubleHashFactory}
  ${"HashTable - Separate Chaining: Linked List"}  | ${hashTableLinkedListFactory}
`("-> $name with fast-check", ({ factory }) => {
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
