import fc from "fast-check";

import { binarySearchTreeFactory } from "../..";

import { commands, Model } from "./commands";

const replay = false;
const replayPath = replay ? "CgP:F" : undefined;
const commandOptions = {
  maxCommands: 100,
  replayPath,
};
const assertOptions = replay
  ? { seed: -60095619, path: "0:2:1:2:1:1:1:1:1", endOnFailure: true }
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
