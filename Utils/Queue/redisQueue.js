import Queue from 'bull';

const messageQueue = new Queue('whatsappQueue', {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
});

// Add message to the queue
const addToQueue = async (recipient, message) => {
  await messageQueue.add({ message, recipient }, {
    attempts: 3,
    delay: 2000 // Delay to control rate limits
  });
};

// Consumer logic for Redis
const consumeMessages = (sock) => {
  messageQueue.process(async (job) => {
    const { recipient, message } = job.data;

    try {
      await sock.sendMessage(recipient, { text: message });
      console.log(`✅ [REDIS] Message sent to ${recipient}: ${message}`);
    } catch (error) {
      console.error(`❌ [REDIS] Failed to send message to ${recipient}:`, error);
    }
  });

  console.log('🚀 [REDIS] Consumer started and ready to process messages...');
};

export default { addToQueue, consumeMessages };
