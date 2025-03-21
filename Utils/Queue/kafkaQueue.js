import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER],
  clientId: 'whatsapp-bot'
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'whatsapp-group' });

const addToQueue = async (recipient, message) => {
  await producer.connect();
  await producer.send({
    messages: [{ value: JSON.stringify({ message, recipient }) }],
    topic: process.env.KAFKA_TOPIC
  });
  console.log(`✅ [KAFKA] Message added to queue for ${recipient}`);
};

const consumeMessages = async (sock) => {
  await consumer.connect();
  await consumer.subscribe({ fromBeginning: true, topic: process.env.KAFKA_TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { recipient, message: text } = JSON.parse(message.value.toString());
      try {
        await sock.sendMessage(recipient, { text });
        console.log(`✅ [KAFKA] Message sent to ${recipient}: ${text}`);
      } catch (error) {
        console.error(`❌ [KAFKA] Failed to send message to ${recipient}:`, error);
      }
    }
  });

  console.log('🚀 [KAFKA] Consumer started and ready to process messages...');
};

export default { addToQueue, consumeMessages };
