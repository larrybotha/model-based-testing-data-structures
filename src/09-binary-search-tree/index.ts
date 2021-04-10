import { BinarySearchTree, BinarySearchTreeNode } from "./types";

const binarySearchTreeNodeFactory = <Value = any>(
  value: Value
): BinarySearchTreeNode<Value> => {
  return {
    left: null,
    right: null,
    value,
  };
};

const binarySearchTreeFactory = <Value = any>(): BinarySearchTree<Value> => {
  let root: BinarySearchTreeNode<Value> | null = null;

  function add(x: Value) {
    const newNode = binarySearchTreeNodeFactory(x);

    if (!root) {
      root = newNode;
    } else {
      insertNode(newNode, root);
    }
  }

  function insertNode(
    node: BinarySearchTreeNode,
    parentNode: BinarySearchTreeNode
  ) {
    const { value, left, right } = parentNode;

    if (node.value <= value) {
      if (left) {
        insertNode(node, left);
      } else {
        parentNode.left = node;
      }
    }

    if (node.value > value) {
      if (right) {
        insertNode(node, right);
      } else {
        parentNode.right = node;
      }
    }
  }

  function remove(_x: Value) {}

  function isPresent(x: Value) {
    return nodeContainsValue(root, x);
  }

  function nodeContainsValue(
    node: BinarySearchTreeNode | null,
    x: Value
  ): boolean {
    if (!node) {
      return false;
    }

    const { value, left, right } = node;

    if (value === x) {
      return true;
    }

    return x <= value
      ? nodeContainsValue(left, x)
      : nodeContainsValue(right, x);
  }

  function findMinHeight(node = root, currentValue = -1) {
    if (!node) {
      return currentValue;
    }

    const { left, right } = node;
    const [leftHeight, rightHeight] = [
      findMinHeight(left, currentValue + 1),
      findMinHeight(right, currentValue + 1),
    ];
    const minHeight = Math.min(leftHeight, rightHeight);

    return minHeight;
  }

  function findMaxHeight(node = root, currentValue = -1) {
    if (!node) {
      return currentValue;
    }

    const { left, right } = node;
    const [leftHeight, rightHeight] = [
      findMinHeight(left, currentValue + 1),
      findMinHeight(right, currentValue + 1),
    ];
    const maxHeight = Math.max(leftHeight, rightHeight);

    return maxHeight;
  }

  return {
    add,
    findMaxHeight,
    findMinHeight,
    isPresent,
    remove,
  };
};

export { binarySearchTreeFactory };
