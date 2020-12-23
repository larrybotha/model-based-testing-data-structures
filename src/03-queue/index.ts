export interface Queue<T = any> {
  dequeue(): T;
  enqueue(value: T): void;
  front(): T;
  isEmpty(): boolean;
  size(): number;
}

const queueFactory = <T = any>(): Queue<T> => {
  let xs: T[] = [];

  function enqueue(value: T) {
    xs = xs.concat(value);
  }

  function dequeue() {
    const value = front();

    xs = xs.slice(1);

    return value;
  }

  function front() {
    const value = xs[0];

    return value;
  }

  function size() {
    return xs.length;
  }

  function isEmpty() {
    return size() === 0;
  }

  return {
    dequeue,
    enqueue,
    front,
    isEmpty,
    size,
  };
};

export { queueFactory };
