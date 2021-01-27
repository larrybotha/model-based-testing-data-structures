interface LinkedListNode<T = any> {
  element: T;
  next: LinkedListNode<T>;
}

export interface LinkedList<T = any> {
  add(value: T): void;
  remove(value: T): void;
  isEmpty(): boolean;
  indexOf(value: T): number;
  elementAt(index: number): T;
  removeAt(index: number): LinkedListNode<T> | null;
  addAt(index: number, value: T): boolean;
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

  function removeAt(index: number) {
    return null;
  }

  function addAt(index: number, value: T) {
    return false;
  }

  return { add, addAt, isEmpty, remove, indexOf, elementAt, removeAt };
}

export { linkedListFactory };
