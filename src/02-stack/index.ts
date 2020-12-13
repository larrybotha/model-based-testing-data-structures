export interface Stack<T = any> {
  pop(): T;
  push(value: T): void;
  size(): number;
}

const stackFactory = <T = any>(): Stack<T> => {
  let xs: T[] = [];

  function pop() {
    const value = xs.slice(-1)[0];
    xs = xs.slice(0, -1);

    return value;
  }

  function push(value: T) {
    xs = xs.concat(value);
  }

  function size() {
    return xs.length;
  }

  return {
    pop,
    push,
    size,
  };
};

export { stackFactory };
