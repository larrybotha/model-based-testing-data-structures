export type PriorityQueueValue<T = any> = [T, number];

export interface PriorityQueue<T = any> {
  dequeue(): T | undefined;
  enqueue(value: PriorityQueueValue<T>): void;
  front(): T | undefined;
  isEmpty(): boolean;
  size(): number;
}

const priorityQueueFactory = function priorityQueueFactory<
  T = any
>(): PriorityQueue<T> {
  let collection: PriorityQueueValue<T>[] = [];

  function enqueue(value: PriorityQueueValue) {
    const [, priority] = value;
    let index = 0;
    let added = false;

    while (!added && index < collection.length) {
      const [, currPriority] = collection[index];

      if (priority < currPriority) {
        const start = collection.slice(0, index);
        const end = collection.slice(index);

        collection = start.concat([value]).concat(end);
        added = true;
      }

      index = index + 1;
    }

    if (!added) {
      collection = collection.concat([value]);
    }
  }

  function front() {
    const [value] = collection.length > 0 ? collection[0] : [undefined];

    return value;
  }

  function dequeue() {
    const value = front();

    collection = collection.slice(1);

    return value;
  }

  function size() {
    return collection.length;
  }

  function isEmpty() {
    return size() === 0;
  }

  return {
    enqueue,
    dequeue,
    size,
    front,
    isEmpty,
  };
};

export { priorityQueueFactory };
