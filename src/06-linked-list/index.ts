interface LinkedListNode<Value = any> {
  element: Value;
  next: LinkedListNode<Value> | null;
}

interface LinkedListNodeFactory<Value = any> {
  (value: Value): LinkedListNode<Value>;
}

export interface LinkedList<T = any> {
  add(value: T): void;
  addAt(index: number, value: T): boolean;
  elementAt(index: number): T | null;
  indexOf(value: T): number;
  isEmpty(): boolean;
  remove(value: T): void;
  removeAt(index: number): void;
}

const linkedListNodeFactory: LinkedListNodeFactory = (value) => ({
  element: value,
  next: null,
});

function linkedListFactory<T = any>(): LinkedList<T> {
  let prefixNode = linkedListNodeFactory(null);
  let length: number = 0;

  function add(value: T) {
    const node = linkedListNodeFactory(value);
    let currNode = prefixNode;

    while (currNode.next !== null) {
      currNode = currNode.next;
    }

    currNode.next = node;

    length++;
  }

  function remove(value: T) {
    let currNode = prefixNode;
    let found = false;

    while (currNode.next && !found) {
      if (currNode.next.element === value) {
        currNode.next = currNode.next.next;
        found = true;
        length--;
      } else {
        currNode = currNode.next;
      }
    }
  }

  function indexOf(value: T) {
    let currNode = prefixNode.next;
    let index = 0;

    while (currNode && currNode.element !== value) {
      currNode = currNode.next;
      index++;
    }

    return index < length ? index : -1;
  }

  function isEmpty() {
    return length === 0;
  }

  function elementAt(index: number) {
    let currNode = prefixNode.next;
    let currIndex = 0;

    while (currNode && currIndex < index) {
      currNode = currNode.next;
      currIndex++;
    }

    return currNode ? currNode.element : null;
  }

  function removeAt(index: number) {
    let currNode = prefixNode;
    let currIndex = 0;

    while (currNode.next && currIndex < index) {
      currNode = currNode.next;
      currIndex++;
    }

    if (currNode.next && currIndex === index) {
      currNode.next = currNode.next ? currNode.next.next : null;
      length--;
    }
  }

  function addAt(index: number, value: T) {
    const node = linkedListNodeFactory(value);
    let currNode = prefixNode;
    let currIndex = 0;

    while (currNode.next && currIndex < index) {
      currNode = currNode.next;
      currIndex++;
    }

    if (currNode && currIndex === index) {
      node.next = currNode.next;
      currNode.next = node;
      length++;

      return true;
    }

    return false;
  }

  return { add, addAt, isEmpty, remove, indexOf, elementAt, removeAt };
}

export { linkedListFactory };
