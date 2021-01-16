export interface CircularQueue<T = any> {
  dequeue(): T | null | undefined;
  enqueue(value: T): T | null;
}

const circularQueueFactory = function circularQueueFactory<T = any>(
  size: number
): CircularQueue<T> {
  /**
   * Array implementation crashes for arbitrary array sizes
   */
  //let collection: Array<T | null> = Array(size).fill(null);
  /**
   * object implementation
   */
  //let collection: Record<number, T | null> = {};
  /**
   * Map implementation
   */
  let collection = new Map<number, T>();
  let readPointer = 0;
  let writePointer = 0;

  function enqueue(value: T) {
    let result = null;

    if (
      /**
       * Array implementation
       */
      //collection[writePointer] === null

      /**
       * object implementation
       */
      //size > 0 &&
      //!(writePointer in collection)

      /**
       * Map implementation
       */
      size > 0 &&
      !collection.has(writePointer)
    ) {
      result = value;

      /**
       * array and object implementation
       */
      //collection[writePointer] = value;
      /**
       * Map implementation
       */
      collection.set(writePointer, value);

      writePointer = (writePointer + 1) % size;
    }

    return result;
  }

  function dequeue() {
    let result = null;

    if (
      size > 0 &&
      /**
       * Array implementation
       */
      //collection[readPointer] !== null

      /**
       * object implementation
       */
      //readPointer in collection

      /**
       * Map implementation
       */
      collection.has(readPointer)
    ) {
      /**
       * array and object implementation
       */
      //result = collection[readPointer];
      /**
       * Map implementation
       */
      result = collection.get(readPointer);

      /**
       * array implementation
       */
      //collection[readPointer] = null;
      /**
       * object implementation
       */
      //delete collection[readPointer];
      /**
       * Map implementation
       */
      collection.delete(readPointer);

      readPointer = (readPointer + 1) % size;
    }

    return result;
  }

  return {
    dequeue,
    enqueue,
  };
};

export { circularQueueFactory };
