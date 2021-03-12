import { DoublyLinkedList } from "./types";

function doublyLinkedListFactory<Value = any>(): DoublyLinkedList<Value> {
  function add(value: Value) {
    console.log(value);
  }

  return {
    add,
  };
}

export { doublyLinkedListFactory };
