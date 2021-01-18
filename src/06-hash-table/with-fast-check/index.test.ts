import fc from "fast-check";

import {
  circularQueueFactory,
  circularQueueArrayFactory,
  circularQueueObjectFactory,
} from "..";

import { commands, Model } from "./commands";

describe.each`
  name        | factory
  ${"Map"}    | ${circularQueueFactory}
  ${"Array"}  | ${circularQueueArrayFactory}
  ${"Object"} | ${circularQueueObjectFactory}
`(
  "-> $name implementation of circular queue with fast-check",
  ({ factory, name }) => {
    /**
     * Array implementation requires upper bound on size of queue, otherwise
     * we get heap memory allocation error
     */
    const maxSize = new RegExp(name, "i").test("array") ? 100 : undefined;

    test("-> model-based", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: maxSize }),
          fc.commands(commands, 100),
          (size, cmds) => {
            const queue = factory(size);
            const model: Model = { writes: 0, size, values: [] };
            const sut = () => ({ model, real: queue });

            fc.modelRun(sut, cmds);
          }
        )
      );
    });

    test("-> always reads from beginning of queue", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: maxSize }),
          fc.array(fc.json()),
          (size, xs) => {
            const queue = factory(size);
            const boundXs = xs.slice(0, size);

            boundXs.map((x) => queue.enqueue(x));
            boundXs.map((x) => {
              expect(queue.dequeue()).toEqual(x);
            });
          }
        )
      );
    });

    test("-> only writes to next value if number of unread writes is less than size", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: maxSize }),
          fc.array(fc.json()),
          (size, xs) => {
            const queue = factory(size);
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
  }
);
