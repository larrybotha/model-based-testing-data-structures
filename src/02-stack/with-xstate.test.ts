import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { stackFactory, Stack } from "./";

interface SUTContext {
  model: any[];
  timesTransitioned: number;
}

const addItem = assign<SUTContext>({
  model: ({ model }, event: any) => model.concat(event.value),
});
const removeItem = assign<SUTContext>({
  model: ({ model }) => model.slice(0, -1),
});
const incrementTransitions = assign<SUTContext>({
  timesTransitioned: ({ timesTransitioned }) => timesTransitioned + 1,
});
const hasItems = ({ model }: SUTContext) => {
  return model.length >= 1;
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
            internal: false,
            target: ".",
            actions: "incrementTransitions",
          },

          REMOVE_ITEM: ".",
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
            internal: false,
            target: ".",
          },

          GET_SIZE: {
            internal: false,
            target: ".",
            actions: "incrementTransitions",
          },

          REMOVE_ITEM: [
            {
              actions: [removeItem, incrementTransitions],
              cond: hasItems,
              internal: false,
              target: ".",
            },
            { actions: [removeItem], target: "empty" },
          ],
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
      incrementTransitions,
      addItem,
    },

    guards: {
      hasItems,
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
});

const filter = (state: any) => {
  const { context } = state;
  const { timesTransitioned } = context;

  return timesTransitioned < 5;
};

describe("stack", () => {
  const simplePathTestPlans = stackModel.getSimplePathPlans({ filter });
  const shortestPathTestPlans = stackModel.getShortestPathPlans({ filter });

  //shortestPathTestPlans.forEach((plan) => {
  simplePathTestPlans.forEach((plan) => {
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
