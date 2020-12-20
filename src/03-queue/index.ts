export interface Queue<T = any> {
  enqueue(T): void;
  dequeue(): T;
}

const queueFactory = <T = any>(): Queue<T> => {
  let xs = [];

  function enqueue(value: T) {
    xs = xs.concat(value);
  }

  function dequeue() {
    const value = xs[0];

    xs = xs.slice(1);

    return value;
  }

  return {
    enqueue,
    dequeue,
  };
};

export { queueFactory };
