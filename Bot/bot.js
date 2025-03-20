import { makeWASocket, useMultiFileAuthState } from "baileys";
import kafkaQueue from '../Utils/Queue/kafkaQueue.js';
import redisQueue from '../Utils/Queue/redisQueue.js';
import inMemoryQueue from '../Utils/Queue/inMemoryQueue.js';
import gaali from './gaali.js';
import galiMatches from './gaaliMatches.js';
let queueModule;

switch (process.env.QUEUE_TYPE?.toLowerCase()) {
    case 'kafka':
        queueModule = kafkaQueue
        break;
    case 'redis':
        queueModule = redisQueue
        break;
    default:
        queueModule = inMemoryQueue
        break;
}

const { addToQueue, consumeMessages } = queueModule;

export async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "close") {
            console.log("Disconnected! Reconnecting...");
            startBot();
        } else if (connection === "open") {
            console.log("✅ WhatsApp Bot Connected!");
        }
    });

    sock.ev.on("messages.upsert", async (msg) => {
        const message = msg.messages[0];
        console.debug(message)
        if (!message.message || message.key.fromMe) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || 
            message.message.extendedTextMessage?.text;
        
        if (text) {
            if (containsSubstring(text.toLocaleLowerCase(), galiMatches)) {
                console.log("The message contains a gaali");
                await addToQueue(sender, getRandomElement(gaali));
            } else {
                console.log("No match found.");
            }
        } else { 
            console.log("Not a text message.");
        }

        // else if (text.toLowerCase().includes("hello")) {
        //     await addToQueue(sock, sender, "Hey there! How can I assist you?");
        // } else if (text.toLowerCase().includes("help")) {
        //     await addToQueue(sock, sender, "Sure! Here are some commands:\n1. Hello\n2. Help");
        // } else {
            // await addToQueue(sock, sender, "I didn't understand that. Type 'help' for options.");
        // }
    });

    await consumeMessages(sock);
}

const containsSubstring = (message, substrings) => { 
    return substrings.some(sub => message.includes(sub));
 }

 const getRandomElement= (arr) =>{
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}