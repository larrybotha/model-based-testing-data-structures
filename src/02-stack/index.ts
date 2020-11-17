const stackFactory = <T = any>() => {
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
