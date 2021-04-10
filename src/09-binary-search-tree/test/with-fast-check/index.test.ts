import fc from "fast-check";

import { binarySearchTreeFactory } from "../..";

import { commands, Model } from "./commands";

const replay = false;
const replayPath = replay ? "ad//J:d" : undefined;
const commandOptions = {
  maxCommands: 100,
  replayPath,
};
const assertOptions = replay
  ? {
      seed: -1767774656,
      path: "1:4:4:7:7:9:8:8:5:6:5:5:6:5:5:5:5:5",
      endOnFailure: true,
    }
  : undefined;

describe.each`
  name                    | factory
  ${"Binary Search Tree"} | ${binarySearchTreeFactory}
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
