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

    if (!root) {
      root = newNode;

      return;
    }

    let currNode = root;

    while (currNode) {
      const { value, left, right } = currNode;

      if (x <= value) {
        if (!left) {
          currNode.left = newNode;
          break;
        } else {
          currNode = left;
        }
      }

      if (x > value) {
        if (!right) {
          currNode.right = newNode;
          break;
        } else {
          currNode = right;
        }
      }
    }
  }

  function insertNode(currNode, value) {}

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
