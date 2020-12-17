export interface Stack<T = any | undefined> {
  pop(): T | undefined;
  push(value: T): void;
  size(): number;
  isEmpty(): boolean;
  peek(): T | undefined;
  clear(): void;
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

  function peek() {
    return xs.slice(-1).find(Boolean);
  }

  function isEmpty() {
    return xs.length === 0;
  }

  function clear() {
    xs = [];
  }

  return {
    clear,
    isEmpty,
    peek,
    pop,
    push,
    size,
  };
};

export { stackFactory };
