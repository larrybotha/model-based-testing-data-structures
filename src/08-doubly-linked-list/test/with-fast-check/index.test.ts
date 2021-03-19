import fc from "fast-check";

import { doublyLinkedListFactory } from "../..";

import { commands, Model } from "./commands";

describe.each`
  name                    | factory
  ${"Doubly Linked List"} | ${doublyLinkedListFactory}
`("-> $name with fast-check", ({ factory }) => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, 100), (cmds) => {
        const hashTable = factory();
        const model: Model = [];
        const sut = () => ({ model, real: hashTable });

        fc.modelRun(sut, cmds);
      })
    );
  });
});
