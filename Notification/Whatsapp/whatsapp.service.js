import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import {incomingConst, outgoingConst} from './gaali.constant.js'
const { Client, LocalAuth } = pkg;

// Create a new client instance
const client = new Client({
    puppeteer:
    {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable'
    },
    authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', (message) => {
    if (message.type == 'chat' && typeof message.body == "string") {
        console.log(message.body)
        if (message.body === 'ping') {
            // send back "pong" to the chat the message was sent in
            message.reply('pong');
        }
        if (incomingConst.includes(message.body.toLocaleLowerCase())) { 
            const randomIndex = Math.floor(Math.random() * outgoingConst.length);
            message.reply(outgoingConst[randomIndex]);
        }
    }
})

// Start your client
try {
    client.initialize();
} catch (err) { 
    console.error("whatsapp error",err)
}