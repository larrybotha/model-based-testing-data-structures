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
      const { data, next } = currNode;

      if (data === value) {
        prevNode.next = next;
      }

      prevNode = currNode;
    }
  }

  return {
    add,
    remove,
  };
}

export { doublyLinkedListFactory };
