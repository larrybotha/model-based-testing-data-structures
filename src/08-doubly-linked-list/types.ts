export interface DoublyLinkedListNode<Data = any> {
  data: Data;
  previous: DoublyLinkedListNode | null;
  next: DoublyLinkedListNode | null;
}

export interface DoublyLinkedList<Value = any> {
  add(value: Value): void;
  remove(value: Value): void;
  elementAt(index: number): Value | null;
  find(value: Value): DoublyLinkedListNode<Value> | null;
  reverse(): void;
}
