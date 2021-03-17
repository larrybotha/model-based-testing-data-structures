export interface DoublyLinkedListNode<Data = any> {
  data: Data;
  previous: DoublyLinkedListNode | null;
  next: DoublyLinkedListNode | null;
}

export interface DoublyLinkedList<Value = any> {
  add(value: Value): void;
  remove(value: Value): void;
  elementAt(index: number): Value;
}
