import fc from "fast-check";

import { doublyLinkedListFactory } from "../..";

import { commands, Model } from "./commands";

const replay = false;
const replayPath = replay ? "2P/XG////d:tP" : undefined;
const commandOptions = {
  maxCommands: 100,
  replayPath,
};
const assertOptions = replay
  ? {
      seed: -1216867315,
      path: "3:4:4:4:10:11:19:18:18:22:21:19:23:24:14:26:27:34:12",
      endOnFailure: true,
    }
  : undefined;

describe.each`
  name                    | factory
  ${"Doubly Linked List"} | ${doublyLinkedListFactory}
`("-> $name with fast-check", ({ factory }) => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(fc.commands(commands, commandOptions), (cmds) => {
        const hashTable = factory();
        const model: Model = [];
        const sut = () => ({ model, real: hashTable });

        fc.modelRun(sut, cmds);
      }),
      assertOptions
    );
  });
});
