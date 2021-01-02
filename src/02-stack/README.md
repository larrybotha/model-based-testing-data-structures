# Stack

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Examples](#examples)
- [When to use](#when-to-use)
- [Pros and Cons](#pros-and-cons)
  - [Pros](#pros)
  - [Cons](#cons)
- [Notes](#notes)
  - [Xstate Model-based Testing](#xstate-model-based-testing)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```bash
$ npm run dev -- src/02*
```

- [index.ts](./index.ts)
- [index.test.js](./index.test.js)

## Examples

- balancing of symbols, e.g. `[({})]` is balanced
- undo / redo
- call stacks
- browser history API
- tower of hanoi
- backtracking algorithms (e.g. time-travel in Redux)
- string reversal

## When to use

- when sequential ordering of items is important, and we don't need to access
    any items except the item at the top of the stack

## Pros and Cons

### Pros

- all methods are `O(1)`

### Cons

- elements are not dynamically accessible

## Notes

- `pop` is `O(1)`
- `push` is `O(1)` - we're appending to a list
- `clear` is `O(1)`
- `peek` is `O(1)`
- `isEmpty` is `O(1)`

### Xstate Model-based Testing

- the model one uses in `fast-check` can be emulated in `@xstate/test` using
    context
- the `filter` option in `createModel().getSimplePathPlans` and
    `createModel().getShortestPathPlans` should be used in the case where
    SUT state machine's context will change indefinitely in order to prevent a
    stack overflow
- multiple states _may_ be used in the machine to describe the states of a data
    structure, but it's not necessary.
    - e.g. a stack could be viewed to have 2 states: `empty`, and `not-empty`.
        This doesn't seem to make much of an improvement as to ensuring that all
        method calls are transitionable. See
        [03-queue/with-xstate/index.test.ts](../03-queue/with-xstate/index.test.ts) to
        see a similar testing structure, but with the redundant state dropped
- in `fast-check` when using model-based-testing on data structures, one both
    augments the model and the real value inside the `run` method, and then
    assertions are done inside the same method if necessary. This only occurs if the
    `check` method for the command returns `true`.
- in `@xstate/test` when using model-based-testing on data structures, the model
    where the events are defined should be used to augment the data structure,
    actions can be used to augment the model, and then the `meta.test` property
    inside the state is used to assert the SUT.
    - this results in events being evaluated in 3 locations:
        - the model of the system (where the events are defined) is where the
            data structure is augmented
        - the actions are where the SUT's internal model is modified
        - `meta.test` is where the data structure and the model are compared and
            assertions are made
    - based on the above, it seems like a lot of effort to test data structures
        with `@xstate/test`. The amount of code required in order to do the same
        assertions with `fast-check` is vastly diminished, there's far less
        cognitive overhead, and `fast-check` does the dirty work in generating
        the test cases dynamically, without us having to do a hacky filter when
        generating the test plans with `@xstate/test`
- `@xstate/test` is possibly not as a good a choice for this kind of testing
    when compared to `fast-check`. Where `@xstate/test` _may_ shine is when
    having to consider a SUT in terms of explicit states. `fast-check`, however,
    may make these states redundant, as all that `fast-check` is concerned with
    is that sequences of commands succeed. There may be scenarios where explicit
    states are beneficial to test, and others where arbitrary sequences of
    commands are beneficial to test.

## Resources

- [Geeks for geeks - stack data structure](https://www.geeksforgeeks.org/stack-data-structure)
