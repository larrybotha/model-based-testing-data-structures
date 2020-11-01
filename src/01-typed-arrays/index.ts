/**
 * creating a typed array using the connstructor and explicit length
 */
const xs: Int8Array = new Int8Array(3);

xs[0] = 1;
console.log(xs);

/**
 * assignments greater than the length are ignored
 */
xs[3] = 1;
console.log(xs);

/**
 * initialised using a buffer
 */
const bufferSize = 24; // 8 bytes per memory allocation, length 3
const buffer = new ArrayBuffer(bufferSize);
const ys = new Float64Array(buffer);

console.log("\n", {
  array: ys,
  arrayBytelength: ys.byteLength,
  bufferByteLength: buffer.byteLength,
});

console.log(
  "\n",
  [Int8Array, Float64Array]
    .map((type) =>
      [`${type.name}.BYTES_PER_ELEMENT`, type.BYTES_PER_ELEMENT].join(": ")
    )
    .join("\n")
);
