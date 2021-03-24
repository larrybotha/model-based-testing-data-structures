import { DoublyLinkedList, DoublyLinkedListNode } from "./types";

const log = (...args: any[]) => {
  const divider = "\n=======================\n";
  console.log(divider, ...args, divider);
};

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
        // make the previous node reference the next node
        if (previous) {
          previous.next = next;
        }

        // make the next node reference the previous node
        if (next) {
          next.previous = previous;
        }

        // if we're at head
        if (!previous) {
          head = next;

          if (head) {
            head.previous = null;
          }
        }

        // if we're at tail
        if (!next) {
          tail = previous ? previous : head;

          if (tail) {
            tail.next = null;
          }
        }

        break;
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

  function find(value: Value) {
    let currNode = head;

    while (currNode) {
      if (currNode.data === value) {
        break;
      }

      currNode = currNode.next;
    }

    return currNode ? currNode : null;
  }

  function reverse() {
    let currNode = head;
    let newTail = null;
    let newHead = null;

    while (currNode) {
      const { previous, next } = currNode;

      // if head
      if (!previous) {
        newTail = currNode;
      }

      // if tail
      if (!next) {
        newHead = currNode;
      }

      currNode.next = previous;
      currNode.previous = next;

      currNode = next;
    }

    head = newHead;
    tail = newTail;
  }

  return {
    add,
    elementAt,
    find,
    remove,
    reverse,
  };
}

export { doublyLinkedListFactory };
