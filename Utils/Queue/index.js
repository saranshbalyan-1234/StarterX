import inMemoryQueue from './inMemoryQueue.js';
import kafkaQueue from './kafkaQueue.js';
import redisQueue from './redisQueue.js';

let queueModule = null;

switch (process.env.QUEUE_TYPE) {
  case 'redis':
    queueModule = redisQueue;
    break;
  case 'kafka':
    queueModule = kafkaQueue;
    break;
  default:
    queueModule = inMemoryQueue;
    break;
}
const { addToQueue, consumeMessages } = queueModule;

export { addToQueue, consumeMessages };
