export interface BinarySearchTreeNode<Value = any> {
  value: Value;
  left: BinarySearchTreeNode | null;
  right: BinarySearchTreeNode | null;
}

export interface BinarySearchTree<Value = any> {
  add(value: Value): void;
  isPresent(value: Value): boolean;
  remove(value: Value): void;
  findMinHeight(node?: BinarySearchTreeNode, currentValue?: number): number;
  findMaxHeight(node?: BinarySearchTreeNode, currentValue?: number): number;

  // depth-first search
  inOrder(node?: BinarySearchTreeNode): Value[];
  postOrder(node?: BinarySearchTreeNode): Value[];
  preOrder(node?: BinarySearchTreeNode): Value[];

  // breadth-first search
  levelOrder(): Value[];
  //reverseLevelOrder(): Value[];
}
