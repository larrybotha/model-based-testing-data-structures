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
    const node = createNode(value, tail);

    if (!head) {
      head = node;
    }

    if (tail) {
      tail.next = node;
    }

    tail = node;
  }

  function remove(value: Value) {
    let currNode = head;

    while (currNode) {
      const { data, next, previous } = currNode;

      if (data === value) {
        if (previous) {
          previous.next = next;
        } else {
          head = next;
        }

        if (!next) {
          tail = previous ? previous : head;
        }
      }

      currNode = next;
    }
  }

  function elementAt(index: number) {
    let currNode = head;
    let count = 0;

    while (count < index && currNode) {
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
