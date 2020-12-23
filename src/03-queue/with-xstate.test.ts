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
        REMOVE_ITEM: ".",
      },

      meta: {
        test: (queue: Queue) => {
          expect(queue.size()).toBe(0);
        },
      },
    },

    notEmpty: {
      on: {
        ADD_ITEM: { internal: false, target: "." },
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
});

describe("queueFactory", () => {
  const testPlans = queueModel.getShortestPathPlans();

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
