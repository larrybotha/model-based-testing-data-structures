import fc, { Command } from "fast-check";

import { BinarySearchTree } from "../../types";

type BinarySearchTreeCommand = Command<any, BinarySearchTree>;

interface ModelEntry<Value = any> {
  addIndex: number;
  value: Value;
}

export type Model = ModelEntry[];
/**
 * IsPresentCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class IsPresentCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const mValues = m.map(({ value }) => value);
    const isPresentInModel = mValues.indexOf(this.value) > -1;
    const isPresent = r.isPresent(this.value);

    expect(isPresent).toBe(isPresentInModel);
  };

  toString = () => `isPresent(${this.value})`;
}

/**
 * AddCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class AddCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const mValues = m.map(({ value }) => value);
    const mValue = mValues.find((v) => v > this.value);
    const index = mValue ? mValues.indexOf(mValue) : 0;
    const ms = m
      .slice(0, index)
      .concat({ value: this.value, addIndex: m.length })
      .concat(m.slice(index));

    for (let i = 0; i < ms.length; i++) {
      m[i] = ms[i];
    }

    r.add(this.value);
  };

  toString = () => `add(${this.value})`;
}

/**
 * FindMinHeightCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class FindMinHeightCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const { length } = m;
    const minHeight = r.findMinHeight();

    switch (true) {
      case length === 0: {
        expect(minHeight).toBe(-1);
        break;
      }
      case length === 1: {
        expect(minHeight).toBe(0);
        break;
      }
      default: {
        expect(minHeight).toBeGreaterThanOrEqual(0);
        break;
      }
    }
  };

  toString = () => `findMinHeight()`;
}

/**
 * FindMaxHeightCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class FindMaxHeightCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const { length } = m;
    const maxHeight = r.findMaxHeight();

    switch (true) {
      case length === 0: {
        expect(maxHeight).toBe(-1);
        break;
      }
      case length === 1: {
        expect(maxHeight).toBe(0);
        break;
      }
      default: {
        expect(maxHeight).toBeGreaterThanOrEqual(1);
        expect(maxHeight).toBeLessThanOrEqual(length);
        break;
      }
    }
  };

  toString = () => `findMaxHeight()`;
}

/**
 * InOrderCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class InOrderCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const sortedMs = m
      .sort(({ value: aValue }, { value: bValue }) =>
        aValue > bValue ? 1 : -1
      )
      .map(({ value }) => value);
    const inOrderR = r.inOrder();

    expect(inOrderR).toEqual(sortedMs);
  };

  toString = () => `inOrder()`;
}

/**
 * PostOrderCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class PostOrderCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const indexOrderedMs = m
      .sort(({ addIndex: addIndexA }, { addIndex: addIndexB }) =>
        addIndexA > addIndexB ? 1 : -1
      )
      .map(({ value }) => value);
    const [firstEntry, secondEntry] = indexOrderedMs;
    const postOrderedXs = r.postOrder();
    // root is last value from post order result
    // left or right of root is element before root
    const [root, leftOrRightA] = postOrderedXs.slice().reverse();
    // other left or right of root is first value after root that is lte root
    const leftOrRightB = postOrderedXs
      .slice(0, -1)
      .reverse()
      .find((x) => x <= root);

    expect(root).toBe(firstEntry);
    expect([leftOrRightA, leftOrRightB]).toContain(secondEntry);
  };

  toString = () => `postOrder()`;
}

/**
 * PreOrderCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class PreOrderCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const indexOrderedMs = m
      .sort(({ addIndex: addIndexA }, { addIndex: addIndexB }) =>
        addIndexA > addIndexB ? 1 : -1
      )
      .map(({ value }) => value);
    const [firstEntry, secondEntry] = indexOrderedMs;
    const preOrderedXs = r.preOrder();
    // root is first value from post order result
    // left or right of root is second value
    const [root, leftOrRightA] = preOrderedXs;
    // other left or right of root is first value after root that is gt root
    const leftOrRightB = preOrderedXs.slice(1).find((x) => x > root);

    expect(root).toBe(firstEntry);
    expect([leftOrRightA, leftOrRightB]).toContain(secondEntry);
  };

  toString = () => `preOrder()`;
}

/**
 * LevelOrderCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class LevelOrderCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const indexOrderedMs = m
      .sort(({ addIndex: addIndexA }, { addIndex: addIndexB }) =>
        addIndexA > addIndexB ? 1 : -1
      )
      .map(({ value }) => value);
    const [firstEntry, secondEntry] = indexOrderedMs;
    // first lte value should be first after root in levelOrder
    const firstLte = indexOrderedMs.slice(1).find((x) => x <= firstEntry);
    // first gt value should be second after root in levelOrder
    const firstGt = indexOrderedMs.slice(1).find((x) => x > firstEntry);
    const levelOrderedXs = r.levelOrder();
    const [root, maybeLeft, maybeRight] = levelOrderedXs;

    // root is the first value from levelOrder result
    expect(root).toBe(firstEntry);
    // the second entry must either be the root's left or right
    expect([maybeLeft, maybeRight]).toContain(secondEntry);

    /**
     * if there are entries on either side of the root value, then we know that
     * those values must be the 2nd and 3rd values in a breadth-first search, and
     * that the root second value should be the root's left
     */
    if (firstGt && firstLte) {
      expect(root).toBeGreaterThanOrEqual(maybeLeft);

      /**
       * the first greater number entered must be the third value in a levelOrder
       * result
       */
      expect(maybeRight).toBe(firstGt);

      /**
       * the first smaller number entered must be the second value in a levelOrder
       * result
       */
      expect(maybeLeft).toBe(firstLte);
    }
  };

  toString = () => `levelOrder()`;
}

/**
 * ReverseLevelOrderCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class ReverseLevelOrderCommand implements BinarySearchTreeCommand {
  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const indexOrderedMs = m
      .sort(({ addIndex: addIndexA }, { addIndex: addIndexB }) =>
        addIndexA > addIndexB ? 1 : -1
      )
      .map(({ value }) => value);
    const [firstEntry, secondEntry] = indexOrderedMs;
    // first lte value should be second after root in reverseLevelOrder
    const firstLte = indexOrderedMs.slice(1).find((x) => x <= firstEntry);
    // first gt value should be first after root in reverseLevelOrder
    const firstGt = indexOrderedMs.slice(1).find((x) => x > firstEntry);
    const reverseLevelOrderedXs = r.reverseLevelOrder();
    const [root, maybeRight, maybeLeft] = reverseLevelOrderedXs;

    // root is the first value from levelOrder result
    expect(root).toBe(firstEntry);
    // the second entry must either be the root's left or right
    expect([maybeLeft, maybeRight]).toContain(secondEntry);

    /**
     * if there are entries on either side of the root value, then we know that
     * those values must be the 2nd and 3rd values in a breadth-first search, and
     * that the root second value should be the root's right
     */
    if (firstLte && firstGt) {
      expect(root).toBeLessThan(maybeRight);

      /**
       * the first greater number entered must be the third value in a levelOrder
       * result
       */
      expect(maybeRight).toBe(firstGt);

      /**
       * the first smaller number entered must be the second value in a levelOrder
       * result
       */
      expect(maybeLeft).toBe(firstLte);
    }
  };

  toString = () => `reverseLevelOrder()`;
}

/**
 * RemoveCommand
 *
 * @implements {BinarySearchTreeCommand}
 */
class RemoveCommand implements BinarySearchTreeCommand {
  constructor(public value: any) {}

  check = () => true;

  run = (m: Model, r: BinarySearchTree) => {
    const index = m.indexOf(this.value);

    if (index > -1) {
      const ms = m.slice(0, index).concat(m.slice(index + 1));

      for (let i = 0; i < ms.length; i++) {
        m[i] = ms[i];
      }
    }

    r.remove(this.value);
  };

  toString = () => `remove(${this.value})`;
}

const values = fc.sample(fc.integer());
const arbIndex = fc.integer({ min: 0, max: values.length - 1 });

const commands = [
  arbIndex.map((index) => new AddCommand(values[index])),
  //arbIndex.map((index) => new RemoveCommand(values[index])),
  arbIndex.map((index) => new IsPresentCommand(values[index])),
  fc.constant(new FindMinHeightCommand()),
  fc.constant(new FindMaxHeightCommand()),

  // depth-first search
  fc.constant(new InOrderCommand()),
  fc.constant(new PostOrderCommand()),
  fc.constant(new PreOrderCommand()),

  // breadth-first search
  fc.constant(new LevelOrderCommand()),
  fc.constant(new ReverseLevelOrderCommand()),
];

export { commands };
