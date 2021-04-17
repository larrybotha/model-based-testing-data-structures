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

const nodeGuard = (node: any): node is BinarySearchTreeNode => node !== null;

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

  /** start depth-first search **/
  function inOrder(node = root): Value[] {
    if (!node) {
      return [];
    }

    const { left, right, value } = node;
    const [leftValues, rightValues] = [left, right].map((n) => inOrder(n));
    const result = [...leftValues, value, ...rightValues];

    return result;
  }

  function postOrder(node = root): Value[] {
    if (!node) {
      return [];
    }

    const { left, right, value } = node;
    const [leftValues, rightValues] = [left, right].map((n) => postOrder(n));
    const result = [...leftValues, ...rightValues, value];

    return result;
  }

  function preOrder(node = root): Value[] {
    if (!node) {
      return [];
    }

    const { left, right, value } = node;
    const [leftValues, rightValues] = [left, right].map((n) => preOrder(n));
    const result = [value, ...leftValues, ...rightValues];

    return result;
  }
  /** end depth-first search **/

  /** start breadth-first search **/
  function levelOrder() {
    const orderLtoR = ({ left, right }: BinarySearchTreeNode) => {
      return [left, right].filter(nodeGuard);
    };

    return _breadthFirstSearch(orderLtoR);
  }

  function reverseLevelOrder() {
    const orderRtoL = ({ left, right }: BinarySearchTreeNode) => {
      return [right, left].filter(nodeGuard);
    };

    return _breadthFirstSearch(orderRtoL);
  }

  function _breadthFirstSearch(
    orderFn: (node: BinarySearchTreeNode) => BinarySearchTreeNode[]
  ) {
    let queue = [root].filter(nodeGuard);
    let nodes: BinarySearchTreeNode[] = [];

    while (queue.length > 0) {
      const node = queue[0];
      const orderedChildNodes = orderFn(node);

      queue = queue.slice(1).concat(orderedChildNodes);
      nodes = nodes.concat(node);
    }

    const result = nodes.map(({ value }) => value);

    return result;
  }
  /** end breadth-first search **/

  return {
    add,
    findMaxHeight,
    findMinHeight,
    isPresent,

    remove,

    // depth-first search
    inOrder,
    postOrder,
    preOrder,

    // breadh-first search
    levelOrder,
    reverseLevelOrder,
  };
};

export { binarySearchTreeFactory };
