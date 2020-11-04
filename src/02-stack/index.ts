const stackFactory = <T = any>() => {
  let xs: T[] = [];

  function pop() {}

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
