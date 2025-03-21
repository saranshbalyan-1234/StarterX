import { makeWASocket, useMultiFileAuthState } from 'baileys';

import { consumeMessages } from '../../Utils/Queue/index.js';

const { state, saveCreds } = await useMultiFileAuthState('auth_info');

let sock = null;

const startWhatsappSocket = () => {
  sock = makeWASocket({
    auth: state,
    markOnlineOnConnect: false,
    printQRInTerminal: true
  });
};
startWhatsappSocket();

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', (update) => {
  const { connection } = update;
  if (connection === 'close') {
    console.log('Disconnected! Reconnecting...');
    startWhatsappSocket();
  } else if (connection === 'open') {
    console.log('✅ WhatsApp Bot Connected!');
  }
});

consumeMessages(sock);

export default sock;
