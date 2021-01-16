export interface CircularQueue<T = any> {
  dequeue(): T | null | undefined;
  enqueue(value: T): T | null;
  size(): number;
}

const circularQueueFactory = function circularQueueFactory<T = any>(
  maxSize: number
): CircularQueue<T> {
  /**
   * Array implementation crashes for arbitrary array sizes
   *
   * O(n)
   */
  //let collection: Array<T | null> = Array(maxSize).fill(null);
  /**
   * object implementation
   *
   * O(1)
   */
  //let collection: Record<number, T | null> = {};
  /**
   * Map implementation
   *
   * O(1)
   */
  let collection = new Map<number, T>();
  let readPointer = 0;
  let writePointer = 0;

  /**
   * enqueue
   *
   * O(1)
   *
   * @param {T} value
   */
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
      //maxSize > 0 &&
      //!(writePointer in collection)

      /**
       * Map implementation
       */
      maxSize > 0 &&
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

      writePointer = (writePointer + 1) % maxSize;
    }

    return result;
  }

  /**
   * dequeue
   *
   * O(1)
   */
  function dequeue() {
    let result = null;

    if (
      maxSize > 0 &&
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

      readPointer = (readPointer + 1) % maxSize;
    }

    return result;
  }

  /**
   * size
   *
   * O(1)
   */
  function size() {
    let result;

    switch (true) {
      /**
       * array implementation
       */
      //case readPointer === writePointer && collection[readPointer] !== null: {
      /**
       * object implementation
       */
      //case readPointer === writePointer && readPointer in collection: {
      /**
       * Map implementation
       */
      case readPointer === writePointer && collection.has(readPointer): {
        result = maxSize;
        break;
      }

      case readPointer > writePointer: {
        result = maxSize - readPointer + writePointer;
        break;
      }

      default: {
        result = writePointer - readPointer;
      }
    }

    return result;
  }

  return {
    dequeue,
    enqueue,
    size,
  };
};

const circularQueueObjectFactory = function circularQueueFactory<T = any>(
  maxSize: number
): CircularQueue<T> {
  /**
   * object implementation
   *
   * O(1)
   */
  let collection: Record<number, T | null> = {};
  /**
   * Map implementation
   *
   * O(1)
   */
  let readPointer = 0;
  let writePointer = 0;

  /**
   * enqueue
   *
   * O(1)
   *
   * @param {T} value
   */
  function enqueue(value: T) {
    let result = null;

    if (maxSize > 0 && !(writePointer in collection)) {
      result = value;

      collection[writePointer] = value;
      writePointer = (writePointer + 1) % maxSize;
    }

    return result;
  }

  /**
   * dequeue
   *
   * O(1)
   */
  function dequeue() {
    let result = null;

    if (maxSize > 0 && readPointer in collection) {
      result = collection[readPointer];
      delete collection[readPointer];
      readPointer = (readPointer + 1) % maxSize;
    }

    return result;
  }

  /**
   * size
   *
   * O(1)
   */
  function size() {
    let result;

    switch (true) {
      case readPointer === writePointer && readPointer in collection: {
        result = maxSize;
        break;
      }

      case readPointer > writePointer: {
        result = maxSize - readPointer + writePointer;
        break;
      }

      default: {
        result = writePointer - readPointer;
      }
    }

    return result;
  }

  return {
    dequeue,
    enqueue,
    size,
  };
};

export { circularQueueFactory, circularQueueObjectFactory };
