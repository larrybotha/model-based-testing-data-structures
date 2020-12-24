import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { stackFactory, Stack } from "./";

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
          ADD_ITEM: { actions: ["addItem"], target: "notEmpty" },
          GET_SIZE: { internal: false, target: "." },
          REMOVE_ITEM: ".",
        },

        meta: {
          test: (stack: Stack, ...args: any[]) => {
            expect(stack.size()).toBe(0);
          },
        },
      },

      notEmpty: {
        on: {
          //ADD_ITEM: { actions: ["addItem"], internal: false, target: "." },
          //GET_SIZE: { internal: false, target: "." },
          REMOVE_ITEM: [
            //{
            //actions: ["removeItem"],
            //cond: "hasItems",
            //internal: false,
            //target: ".",
            //},
            { actions: ["removeItem"], target: "empty" },
          ],
        },

        meta: {
          test: (stack: Stack) => {
            expect(stack.size()).toBeGreaterThan(0);
          },
        },
      },
    },
  },

  {
    actions: {
      addItem: assign(({ model, timesTransitioned }, event: any) => {
        return {
          model: model.concat(event.value),
          timesTransitioned: timesTransitioned + 1,
        };
      }),

      removeItem: assign(({ model, timesTransitioned }) => {
        console.log(model);
        return {
          model: model.slice(0, -1),
          timesTransitioned: timesTransitioned + 1,
        };
      }),

      //incrementTransitions: assign((context) => ({
      //...context,
      //timesTransitioned: context.timesTransitioned + 1,
      //})),
    },

    guards: {
      hasItems: ({ model }) => {
        return model.length >= 1;
      },
    },
  }
);

const stackModel = createModel<Stack, SUTContext>(sutMachine).withEvents({
  ADD_ITEM: {
    exec: (stack, event: any) => {
      stack.push(event.value);
    },
    cases: [{ value: "foo" }, { value: "bar" }],
  },

  REMOVE_ITEM: {
    exec: (stack) => {
      stack.pop();
    },
  },

  //GET_SIZE: {
  //exec: (stack) => {
  //stack.size();
  //},
  //},
});

describe("stack", () => {
  const simplePathTestPlans = stackModel.getSimplePathPlans({
    filter: (state) => {
      const { context } = state;
      const { timesTransitioned, model } = context;

      return timesTransitioned > 2 || model.length > 2;
    },
  });
  const shortestPathTestPlans = stackModel.getShortestPathPlans();

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
