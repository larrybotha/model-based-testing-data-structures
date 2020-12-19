export interface Queue<T = any> {
  push(T): void;
}

const queueFactory = <T = any>(): Queue<T> => {
  let xs = [];

  function push(value: T) {
    xs = xs.concat(value);
  }

  return {
    push,
  };
};

export { queueFactory };
