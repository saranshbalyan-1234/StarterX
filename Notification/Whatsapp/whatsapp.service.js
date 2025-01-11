import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
const { Client, LocalAuth } = pkg;

// Create a new client instance
const client = new Client({
    puppeteer:
    {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
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

client.on('message', (message) => {
    console.log(1, message.body)
})

client.on('message_create', (message) => {
    console.log(2, message.body)
})

// Start your client
try {
    client.initialize();
} catch (err) { 
    console.error("whatsapp error",err)
}