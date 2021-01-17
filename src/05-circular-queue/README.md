# Circular Queue

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Complexity](#complexity)
- [Examples](#examples)
- [When to use](#when-to-use)
- [Pros and Cons](#pros-and-cons)
  - [Pros](#pros)
  - [Drawbacks](#drawbacks)
- [Notes](#notes)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```bash
# TypeScript
$ npm run dev -- src/05*

# Tests
$ npm run test:watch -- src/05*

# Benchmark
$ node -r ./node_modules/ts-node/register ./src/05-circular-queue/benchmark.ts
```

- [index.ts](./index.ts)
- [index.test.js](./index.test.js)

## Complexity

- enqueue has time complexity O(1)
- dequeue has time complexity O(1)

## Examples

- software-controlled traffic lights
    - red -> green -> amber -> red
- CPU scheduling
- memory management
- luggage carousel
- escalators
- looped execution of a slideshow
- assigning turns in multiplayer games

## When to use

- situations where one needs to maintain a first-come-first-serve approach such
    that after the last task one needs to go back to the first task

## Pros and Cons

### Pros

- can improve memory consumption
- can distribute processing across multiple processes
- O(1) time complexity on `enqueue`, `dequeue`, and `size`

### Drawbacks

- fixed length may be problematic in some situations

## Notes

- is a linear data structure
- also known as:
  - ring buffer
  - circular buffer
- in Javascript a queue can be enqueued indefinitely - in many other languages
    this isn't so due to the fixed-size nature of array implementations. With a circular
    queue one can enqueue indefinitely (as long as there are items being dequeued)
- in *Round Robin Scheduling*, processes on the CPU are given an amount of time
    to use the CPU. If they are complete before their alloted time, they are
    removed from the queue. If they are not yet complete, they are moved to the
    end of the queue, and the next process is alloted time for processing.
- a circular queue can be used to improve memory management - a queue with
    dequeued entries is essentially wasting memory, as the memory allocated to
    those entries can't be used again. With a circular queue, that memory can be
    reused.

## Resources

- [Geeks for geeks - circular queue data structure](https://www.geeksforgeeks.org/circular-queue-set-1-introduction-array-implementation/)
- [Programiz - circular queue](https://www.programiz.com/dsa/circular-queue)
- [CSVeda - circular queue - memory representation and applications](https://csveda.com/circular-queue-memory-representation-and-applications/)
- Round Robin Scheduling
  - [Geeks for geeks - CPU scheduling in operating systems](https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/)
  - [Notes for MSc - Round Robin](https://notesformsc.org/round-robin/)
