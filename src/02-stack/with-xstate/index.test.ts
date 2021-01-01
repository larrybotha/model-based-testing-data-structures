import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { testAllPlans } from "@testutils";

import { stackFactory, Stack } from "..";

interface SUTContext {
  model: any[];
  timesTransitioned: number;
}

const sutMachine = Machine<SUTContext>(
  {
    id: "stack-sut",

    initial: "empty",

    context: {
      model: [],
      timesTransitioned: 0,
    },

    states: {
      empty: {
        on: {
          ADD_ITEM: {
            actions: ["addItem", "incrementTransitions"],

            target: "notEmpty",
          },

          GET_SIZE: {
            target: ".",
            actions: "incrementTransitions",
          },

          REMOVE_ITEM: {
            target: ".",
            actions: "incrementTransitions",
          },

          PEEK: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          CLEAR: {
            target: ".",
            actions: "incrementTransitions",
          },
        },

        meta: {
          test: (stack: Stack) => {
            expect(stack.size()).toBe(0);
          },
        },
      },

      notEmpty: {
        on: {
          ADD_ITEM: {
            actions: ["addItem", "incrementTransitions"],
            target: ".",
          },

          GET_SIZE: {
            target: ".",
            actions: "incrementTransitions",
          },

          REMOVE_ITEM: [
            {
              actions: ["removeItem", "incrementTransitions"],
              cond: "hasItems",
              target: ".",
            },
            { actions: ["removeItem"], target: "empty" },
          ],

          PEEK: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          CLEAR: {
            actions: ["clearItems", "incrementTransitions"],
            target: "empty",
          },
        },

        meta: {
          test: (stack: Stack, state: any) => {
            expect(stack.size()).toBe(state.context.model.length);
          },
        },
      },
    },
  },

  {
    actions: {
      addItem: assign<SUTContext>({
        model: ({ model }, event: any) => model.concat(event.value),
      }),

      removeItem: assign<SUTContext>({
        model: ({ model }) => model.slice(0, -1),
      }),

      clearItems: assign<SUTContext>({
        model: [],
      }),

      incrementTransitions: assign<SUTContext>({
        timesTransitioned: ({ timesTransitioned }) => timesTransitioned + 1,
      }),
    },

    guards: {
      hasItems: ({ model }: SUTContext) => {
        return model.length > 0;
      },
    },
  }
);

const stackModel = createModel<Stack, SUTContext>(sutMachine).withEvents({
  ADD_ITEM: {
    exec: (stack, event: any) => {
      stack.push(event.value);
    },
    cases: [{ value: "foo" }],
  },

  REMOVE_ITEM: {
    exec: (stack) => {
      stack.pop();
    },
  },

  GET_SIZE: {
    exec: (stack) => {
      stack.size();
    },
  },

  PEEK: {
    exec: (stack) => {
      stack.peek();
    },
  },

  CLEAR: {
    exec: (stack) => {
      stack.clear();
    },
  },

  CHECK_IF_EMPTY: {
    exec: (stack) => {
      stack.clear();
    },
  },
});

const filter = (state: any) => {
  const { context } = state;
  const { timesTransitioned } = context;

  return timesTransitioned < 5;
};

describe("stack", () => {
  const simplePathTestPlans = stackModel.getSimplePathPlans({ filter });
  const shortestPathTestPlans = stackModel.getShortestPathPlans({ filter });

  describe("-> simple paths", () => {
    testAllPlans(simplePathTestPlans, async (testPath) => {
      const stack = stackFactory();

      await testPath.test(stack);
    });
  });

  describe("-> shortest paths", () => {
    testAllPlans(shortestPathTestPlans, async (testPath) => {
      const stack = stackFactory();

      await testPath.test(stack);
    });
  });

  test("-> has full coverage", () => {
    return stackModel.testCoverage();
  });
});
