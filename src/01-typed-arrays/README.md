# Typed Arrays

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [When to use](#when-to-use)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```bash
$ npm run dev -- src/01*
```

## When to use

- when a normal array, allowing dynamic types, does not suit performance
    requirements

## Notes

- a typed array:
  - has a fixed size
  - is initialised for a specific type:

      | type              | size in bytes |
      | ---               | ---           |
      | Int8Array         | 1             |
      | Uint8Array        | 1             |
      | Uint8ClampedArray | 1             |
      | Int16Array        | 2             |
      | Uint16Array       | 2             |
      | Int32Array        | 4             |
      | Uint32Array       | 4             |
      | Float32Array      | 4             |
      | Float64Array      | 8             |

      These values can all be retrieved by evaluating `[Type].BYTES_PER_ELEMENT`
- a typed array can be created in one of two ways:
  - directly, providing the size on initialisation:

      ```ts
      // int8 array of length 3
      const xs = new Int8Array(3)

      console.log(xs)
      // => Int8Array[0, 0, 0]
      ```
  - using a buffer, providing the size in bytes (length must be the product of
      the length and the bytes for the type of the typed array)

      ```ts
      // float 64 array of length 3; 3 * 8
      const bufferSize = 24
      const buffer = new ArrayBuffer(bufferSize)
      const xs = new Float64Array(buffer)

      // => Float64Array[0, 0, 0]
      ```

      - will throw if attempting to provide an invalid buffer size
      - byte length can be retrieved using `[xs | buffer].byteLength`
- typed arrays can have values assigned at keyed indexes, like normal arrays:

    ```ts
    const xs = new Int8Array(3)

    xs[0] = 1

    console.log(xs)
    // => Int8Array[1,0,0]
    ```
- assigning a value to an index greater than the length of the array will be
    ignored
