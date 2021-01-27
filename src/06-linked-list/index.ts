export interface LinkedList<T = any> {
  add(value: T): void;
  remove(value: T): void;
  isEmpty(): boolean;
  indexOf(value: T): number;
  elementAt(index: number): T;
}

function linkedListFactory<T = any>(): LinkedList<T> {
  function add(value: T) {}
  function remove(value: T) {}
  function isEmpty() {
    return true;
  }
  function indexOf(value: T) {
    return -1;
  }
  function elementAt(index: number) {
    return (undefined as unknown) as T;
  }

  return { add, isEmpty, remove, indexOf, elementAt };
}

export { linkedListFactory };
