export interface LinkedList<T = any> {
  add(value: T): void;
}

function linkedListFactory<T = any>(): LinkedList<T> {
  function add(value: T) {}

  return { add };
}

export { linkedListFactory };
