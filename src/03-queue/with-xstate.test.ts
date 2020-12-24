import { assign, Machine } from "xstate";
import { createModel } from "@xstate/test";

import { queueFactory, Queue } from "./";

const queueMachine = Machine({
  id: "queue",

  initial: "empty",

  context: { hasTransitioned: false },

  states: {
    empty: {
      on: {
        ADD_ITEM: "notEmpty",
        GET_SIZE: { internal: false, target: "." },
        REMOVE_ITEM: ".",
      },

      meta: {
        test: (queue: Queue) => {
          expect(queue.size()).toBe(0);
        },
      },
    },

    notEmpty: {
      exit: assign({ hasTransitioned: true }),

      on: {
        ADD_ITEM: { internal: false, target: "." },
        GET_SIZE: { internal: false, target: "." },
        REMOVE_ITEM: "empty",
      },

      meta: {
        test: (queue: Queue) => {
          expect(queue.size()).toBeGreaterThan(0);
        },
      },
    },
  },
});

const queueModel = createModel<Queue, any>(queueMachine).withEvents({
  ADD_ITEM: {
    exec: (queue) => {
      queue.enqueue("foo");
    },
  },

  REMOVE_ITEM: {
    exec: (queue) => {
      queue.dequeue();
    },
  },

  GET_SIZE: {
    exec: (queue) => {
      queue.size();
    },
  },
});

describe("queueFactory", () => {
  const testPlans = queueModel.getShortestPathPlans();
  //const testPlans = queueModel.getSimplePathPlans();

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        test(path.description, async () => {
          const queue = queueFactory();

          await path.test(queue);
        });
      });
    });
  });

  test("-> has full coverage", () => {
    return queueModel.testCoverage();
  });
});
