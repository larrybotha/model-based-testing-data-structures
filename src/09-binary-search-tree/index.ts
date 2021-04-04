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
    let currNode = root;
    let present = false;

    while (currNode && !present) {
      const { value, left, right } = currNode;

      if (x === value) {
        present = true;
        break;
      }

      if (x <= value) {
        currNode = left;
      } else {
        currNode = right;
      }
    }

    return present;
  }

  return {
    add,
    isPresent,
    remove,
  };
};

export { binarySearchTreeFactory };
