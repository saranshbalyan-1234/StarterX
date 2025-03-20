const messageQueue = [];

 async function addToQueue(sock, recipient, message) {
    messageQueue.push({ sock, recipient, message });
    console.log(`✅ [IN-MEMORY] Message added for ${recipient}`);
}

 async function consumeMessages() {
    setInterval(async () => {
        if (messageQueue.length === 0) return;

        const job = messageQueue.shift();
        const { sock, recipient, message } = job;

        try {
            await sock.sendMessage(recipient, { text: message });
            console.log(`✅ [IN-MEMORY] Message sent to ${recipient}: ${message}`);
        } catch (error) {
            console.error(`❌ [IN-MEMORY] Failed to send message to ${recipient}:`, error);
        }
    }, 2000);  // Controls message rate
}


export default {addToQueue, consumeMessages};