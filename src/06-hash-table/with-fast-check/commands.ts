import fc, { Command } from "fast-check";

import { HashTable } from "..";

type HashTableCommand = Command<any, HashTable>;

export interface Model {}

/**
 * []
 *
 *
 * @implements {HashTableCommand}
 */
class EnqueueCommand implements HashTableCommand {}

/**
 * []
 *
 *
 * @implements {HashTableCommand}
 */
class DequeueCommand implements HashTableCommand {}

const commands = [];

export { commands };
