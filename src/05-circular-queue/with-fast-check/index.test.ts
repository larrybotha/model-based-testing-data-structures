import fc from "fast-check";

import { circularQueueFactory } from "..";

import { commands, Model } from "./commands";

describe("circular queue with fast-check", () => {
  test("-> model-based", () => {
    fc.assert(
      fc.property(
        /**
         * Array implementation requires upper bound on size of queue, otherwise
         * we get heap memory allocation error
         */
        //fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 0 }),
        fc.commands(commands, 100),
        (size, cmds) => {
          const queue = circularQueueFactory(size);
          const model: Model = { writes: 0, size, values: [] };
          const sut = () => ({ model, real: queue });

          fc.modelRun(sut, cmds);
        }
      )
    );
  });

  test("-> always reads from beginning of queue", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0 }), fc.array(fc.json()), (size, xs) => {
        const queue = circularQueueFactory(size);
        const boundXs = xs.slice(0, size);

        boundXs.map((x) => queue.enqueue(x));
        boundXs.map((x) => {
          expect(queue.dequeue()).toEqual(x);
        });
      })
    );
  });

  test("-> only writes to next value if number of unread writes is less than size", () => {
    fc.assert(
      fc.property(
        /**
         * Array implementation requires upper bound on size of queue, otherwise
         * we get heap memory allocation error
         */
        //fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 0 }),
        fc.array(fc.json()),
        (size, xs) => {
          const queue = circularQueueFactory(size);
          let writes = 0;

          xs.map((x) => {
            const result = queue.enqueue(x);

            if (result !== null) {
              writes = writes + 1;
            }
          });

          expect(writes).toBeLessThanOrEqual(size);
        }
      )
    );
  });
});
