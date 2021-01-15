export interface CircularQueue<T = any> {
  dequeue(): T | null;
  enqueue(value: T): T | null;
}

const priorityQueueFactory = function priorityQueueFactory<T = any>(
  size: number
): CircularQueue<T> {
  let collection: Array<T | null> = Array(size).fill(null);
  let readPointer = 0;
  let writePointer = 0;

  function enqueue(value: T) {
    return null;
  }

  function dequeue() {
    return null;
  }

  return {
    dequeue,
    enqueue,
  };
};

export { priorityQueueFactory };
