export interface BinarySearchTreeNode<Value = any> {
  value: Value;
  left: BinarySearchTreeNode | null;
  right: BinarySearchTreeNode | null;
}

export interface BinarySearchTree<Value = any> {
  add(value: Value): void;
  isPresent(value: Value): boolean;
  remove(value: Value): void;
}
