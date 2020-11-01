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
