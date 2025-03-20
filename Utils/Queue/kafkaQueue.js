import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'whatsapp-bot',
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'whatsapp-group' });

 async function addToQueue(sock, recipient, message) {
    await producer.connect();
    await producer.send({
        topic: process.env.KAFKA_TOPIC,
        messages: [{ value: JSON.stringify({ sock, recipient, message }) }]
    });
    console.log(`✅ [KAFKA] Message added to queue for ${recipient}`);
}

 async function consumeMessages(sock) {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { sock, recipient, message: text } = JSON.parse(message.value.toString());
            try {
                await sock.sendMessage(recipient, { text });
                console.log(`✅ [KAFKA] Message sent to ${recipient}: ${text}`);
            } catch (error) {
                console.error(`❌ [KAFKA] Failed to send message to ${recipient}:`, error);
            }
        }
    });

    console.log('🚀 [KAFKA] Consumer started and ready to process messages...');
}

export default {addToQueue, consumeMessages};