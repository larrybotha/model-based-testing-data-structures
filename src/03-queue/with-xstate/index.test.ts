import { AnyEventObject, assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { testAllPlans } from "@testutils";

import { queueFactory, Queue } from "..";

interface SUTContext {
  model: any[];
  timesTransitioned: number;
}

const assertEvent = (
  queue: Queue,
  { context, event }: { context: SUTContext; event: AnyEventObject }
) => {
  const { model } = context;

  switch (event.type) {
    case "ADD_ITEM":
    case "REMOVE_ITEM":
    case "GET_SIZE": {
      expect(queue.size()).toBe(model.length);
      break;
    }

    case "PEEK": {
      const expected = model.slice().shift();
      const actual = queue.front();

      expect(actual).toBe(expected);
      break;
    }

    case "CHECK_IF_EMPTY": {
      const expected = Boolean(model.length === 0);
      const actual = queue.isEmpty();

      expect(actual).toBe(expected);
      break;
    }
  }
};

const sutMachine = Machine<SUTContext>(
  {
    id: "queue-sut",

    initial: "pending",

    context: {
      model: [],
      timesTransitioned: 0,
    },

    states: {
      pending: {
        on: {
          ADD_ITEM: {
            actions: ["addItem", "incrementTransitions"],
            target: ".",
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
        },

        meta: {
          test: assertEvent,
        },
      },
    },
  },

  {
    // update the model
    actions: {
      addItem: assign<SUTContext>({
        model: ({ model }, event: any) => [event.value].concat(model),
      }),

      removeItem: assign<SUTContext>({
        model: ({ model }) => model.slice(0, -1),
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
const queueModel = createModel<Queue, SUTContext>(sutMachine).withEvents({
  ADD_ITEM: {
    exec: (queue, event: any) => {
      queue.enqueue(event.value);
    },
    cases: [{ value: "foo" }],
  },

  REMOVE_ITEM: {
    exec: (queue) => {
      queue.dequeue();
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
    Math.ceil((2 * Object.keys(queueModel.options.events).length) / 3)
  );
};

describe("queue", () => {
  const simplePathTestPlans = queueModel.getSimplePathPlans({ filter });
  const shortestPathTestPlans = queueModel.getShortestPathPlans({ filter });

  describe("-> simple paths", () => {
    testAllPlans(simplePathTestPlans, async (testPath) => {
      const queue = queueFactory();

      await testPath.test(queue);
    });
  });

  describe("-> shortest paths", () => {
    testAllPlans(shortestPathTestPlans, async (testPath) => {
      const queue = queueFactory();

      await testPath.test(queue);
    });
  });

  test("-> has full coverage", () => {
    return queueModel.testCoverage();
  });
});
