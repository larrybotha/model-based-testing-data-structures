import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { stackFactory } from "./";

const stackMachine = Machine({
  id: "stack",

  initial: "empty",

  context: { hasTransitioned: false },

  on: {
    GET_SIZE: ".",
  },

  states: {
    empty: {
      exit: assign({ hasTransitioned: true }),

      on: {
        ADD_ITEM: "notEmpty",
        REMOVE_ITEM: ".",
      },

      meta: {
        test: (stack: any, ...rest) => {
          expect(stack.size()).toBe(0);
        },
      },
    },

    notEmpty: {
      on: {
        ADD_ITEM: ".",
        REMOVE_ITEM: "empty",
      },

      meta: {
        test: (stack: any, ...rest: any[]) => {
          debugger;
          expect(stack.size()).toBeGreaterThan(0);
        },
      },
    },
  },
});

const stackModel = createModel(stackMachine).withEvents({
  ADD_ITEM: {
    exec: (stack: any, ...rest: any[]) => {
      stack.push("foo");

      return "goo";
    },
    cases: [
      { filterBy: "field1" },
      { filterBy: "field2" },
      { filterBy: "field3" },
    ],
  },

  REMOVE_ITEM: {
    exec: (stack: any) => {
      stack.pop();
    },
  },

  GET_SIZE: {
    exec: (stack: any) => {
      stack.size();
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
