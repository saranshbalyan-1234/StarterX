import { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

// Create a new client instance
const client = new Client();

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

// Start your client
client.initialize();
