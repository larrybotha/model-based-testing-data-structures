import { BinarySearchTree, BinarySearchTreeNode } from "./types";

const binarySearchTreeNodeFactory = <Value = any>(
  value: Value
): BinarySearchTreeNode<Value> => {
  return {
    value,
    left: null,
    right: null,
  };
};

const binarySearchTreeFactory = <Value = any>(): BinarySearchTree<Value> => {
  let root: BinarySearchTreeNode<Value> | null = null;

  function add(x: Value) {
    const newNode = binarySearchTreeNodeFactory(x);

    insertNode(newNode, root);
  }

  function insertNode(
    node: BinarySearchTreeNode,
    parentNode: BinarySearchTreeNode | null
  ) {
    if (!parentNode) {
      root = node;

      return;
    }

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

  function remove(x: Value) {}

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

  return {
    add,
    isPresent,
    remove,
  };
};

export { binarySearchTreeFactory };
