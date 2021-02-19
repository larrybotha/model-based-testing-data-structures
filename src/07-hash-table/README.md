# Hash Table

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Complexity](#complexity)
- [Examples](#examples)
- [When to use](#when-to-use)
- [Notes](#notes)
- [Resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```bash
# TypeScript
$ npm run dev -- src/07*

# Tests
$ npm run test:watch -- src/07*

# Benchmark
$ node -r ./node_modules/ts-node/register ./src/07-hash-table/benchmark.ts
```

- [index.ts](./index.ts)
- [index.test.js](./index.test.js)

## Complexity

- add - depends on hashing function
- remove - depends on hashing function
- lookup - O(1) on average, O(n) in worst case

## Examples

- creating a telephone book in a data structure with average time complexity of O(1),
    and max time complexity of O(n) on lookup

## When to use

- when a data structure with efficient lookups is required

## Notes

- a hash table is a data structure that uses hashing to store and retrieve
    values from the data structure
- hashing is a mechanism that returns more compact values from original values
- hashing is valuable in situations where simply using the value as the key
    wouldn't be possible, e.g. if we were storing telephone numbers, there may
    be an upper bound on the size of the array that a telephone number may be
    expected to inhabit. Instead of using the telephone number, a hashing
    function can generate a smaller number using the telephone number. This
    smaller number can be used internally by the hash table to reference the
    value.
- the time complexity of a hash table is dependent on the complexity of the
    hashing function
- a hash table should account for it's hashing function returning hashed keys
    that result in collisions.
    - a collision is when two different values passed to the hashing function
        generate the same key
- there are different methods of managing collisions with hashing functions,
    each with pros and cons:
    - chaining - using a linked list to append values to each other
        when collisions occur
    - open addressing - storing all of the values directly on the table,
        iterating through slots until the value is found. This can be done in a
        number of ways:
        - linear probing - incrementing the hashed key until an unused slot is
            found
            - Can result in many operations to find an open slot or find a a value
                (clustering)
            - has the best caching performance
            - easy to implement
        - quadratic probing - using a quadratic function to increase the key
            when collisions occur
            - forms a middle ground between cache performance and clustering in
                linear probing implementation
        - double-hashing - running a second hashing function to resolve
            collisions
            - poor caching performance due to running 2 hashing functions
            - does not suffer from clustering

## Resources

- [Educative.io - Data Structures 101: implement hash tables in JavaScript](https://www.educative.io/blog/data-strucutres-hash-table-javascript)
- [Geeks For Geeks - Hashing](https://www.geeksforgeeks.org/hashing-set-1-introduction/)
- [Geeks For Geeks - Hashing - Separate Chaining](https://www.geeksforgeeks.org/hashing-set-2-separate-chaining/)
- [Geeks For Geeks - Hashing - Open Addressing](https://www.geeksforgeeks.org/hashing-set-3-open-addressing/)
- [Geeks For Geeks - Double Hashing](https://www.geeksforgeeks.org/double-hashing/)
- [CSC2100B - Hashing (diagrams)](https://www.cse.cuhk.edu.hk/irwin.king/_media/teaching/csc2100b/tu6.pdf)
