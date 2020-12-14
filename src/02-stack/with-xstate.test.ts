import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { stackFactory } from "./";
import { Stack } from "./";

const stackMachine = Machine({
  id: "stack",

  initial: "empty",

  context: { hasTransitioned: false },

  states: {
    empty: {
      on: {
        ADD_ITEM: "notEmpty",
        REMOVE_ITEM: ".",
      },

      meta: {
        test: (stack: Stack) => {
          expect(stack.size()).toBe(0);
        },
      },
    },

    notEmpty: {
      exit: assign({ hasTransitioned: true }),

      on: {
        ADD_ITEM: { internal: false, target: "." },
        REMOVE_ITEM: "empty",
      },

      meta: {
        test: (stack: Stack) => {
          expect(stack.size()).toBeGreaterThan(0);
        },
      },
    },
  },
});

const stackModel = createModel<Stack, any>(stackMachine).withEvents({
  ADD_ITEM: {
    exec: (stack) => {
      stack.push("foo");
    },
  },

  REMOVE_ITEM: {
    exec: (stack) => {
      stack.pop();
    },
  },
});

describe("stack", () => {
  const testPlans = stackModel.getShortestPathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          const stack = stackFactory();

          await path.test(stack);
        });
      });
    });
  });

  it("should have full coverage", () => {
    return stackModel.testCoverage();
  });
});
