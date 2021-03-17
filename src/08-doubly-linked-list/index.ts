import { DoublyLinkedList, DoublyLinkedListNode } from "./types";

function createNode<Data = any>(
  data: Data,
  previous: DoublyLinkedListNode<Data>["previous"] = null
): DoublyLinkedListNode<Data> {
  return {
    data,
    previous,
    next: null,
  };
}

function doublyLinkedListFactory<Value = any>(): DoublyLinkedList<Value> {
  let tail: DoublyLinkedListNode | null = null;
  let head: DoublyLinkedListNode | null = null;
  const prefixNode = createNode(null);
  prefixNode.next = head;

  function add(value: Value) {
    const node = createNode(value);

    if (!head) {
      head = node;
    }

    if (tail) {
      tail.next = node;
    }

    tail = node;
  }

  function remove(value: Value) {
    let prevNode = createNode(null);
    prevNode.next = head;

    while (prevNode.next) {
      const currNode = prevNode.next;
      const { data, next, previous } = currNode;

      if (data === value) {
        prevNode.next = next;
      }

      if (!next) {
        tail = currNode;
      }

      if (!previous) {
        head = currNode;
      }

      prevNode = currNode;
    }
  }

  function elementAt(index: number) {
    let currNode = prefixNode;
    let count = -1;

    while (count < index && currNode.next) {
      currNode = currNode.next;
      count++;
    }

    return currNode ? currNode.data : null;
  }

  return {
    add,
    remove,
    elementAt,
  };
}

export { doublyLinkedListFactory };
