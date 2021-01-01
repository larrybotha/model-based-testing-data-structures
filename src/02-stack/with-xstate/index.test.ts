import { AnyEventObject, assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { testAllPlans } from "@testutils";

import { stackFactory, Stack } from "..";

interface SUTContext {
  model: any[];
  timesTransitioned: number;
}

const assertEvent = (
  stack: Stack,
  { context, event }: { context: SUTContext; event: AnyEventObject }
) => {
  const { model } = context;

  switch (event.type) {
    case "ADD_ITEM":
    case "REMOVE_ITEM":
    case "GET_SIZE": {
      expect(stack.size()).toBe(model.length);
      break;
    }

    case "PEEK": {
      const expected = model.slice().pop();
      const actual = stack.peek();

      expect(actual).toBe(expected);
      break;
    }

    case "CHECK_IF_EMPTY": {
      const expected = Boolean(model.length === 0);
      const actual = stack.isEmpty();

      expect(actual).toBe(expected);
      break;
    }

    case "CLEAR": {
      expect(stack.size()).toBe(0);
      break;
    }
  }
};

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
            actions: ["incrementTransitions"],
            target: ".",
          },

          REMOVE_ITEM: {
            actions: ["removeItem", "incrementTransitions"],
            target: ".",
          },

          CHECK_IF_EMPTY: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          PEEK: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          CLEAR: {
            actions: ["clearItems", "incrementTransitions"],
            target: ".",
          },
        },

        meta: {
          test: (stack: Stack, state: any) => {
            expect(stack.size()).toBe(0);

            assertEvent(stack, state);
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
            actions: ["incrementTransitions"],
            target: ".",
          },

          REMOVE_ITEM: [
            {
              actions: ["removeItem", "incrementTransitions"],
              cond: "hasItems",
              target: ".",
            },
            {
              actions: ["removeItem", "incrementTransitions"],
              target: "empty",
            },
          ],

          PEEK: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          CHECK_IF_EMPTY: {
            actions: ["incrementTransitions"],
            target: ".",
          },

          CLEAR: {
            actions: ["clearItems", "incrementTransitions"],
            target: "empty",
          },
        },

        meta: { test: assertEvent },
      },
    },
  },

  {
    // update the model
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

// update the real value
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

  CLEAR: {
    exec: (stack) => {
      stack.clear();
    },
  },

  GET_SIZE: {},
  PEEK: {},
  CHECK_IF_EMPTY: {},
});

const filter = (state: any) => {
  const { context } = state;
  const { timesTransitioned } = context;

  // how many transitions will be sufficient to cover potentially problematic
  // sequences of events?
  return (
    timesTransitioned <
    Math.ceil((2 * Object.keys(stackModel.options.events).length) / 3)
  );
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
