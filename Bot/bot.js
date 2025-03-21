import sock from '#notification/Whatsapp/whatsapp.service.js';

import { addToQueue } from '../Utils/Queue/index.js';
import gaali from './gaali.js';
import galiMatches from './gaaliMatches.js';

sock.ev.on('messages.upsert', async (msg) => {
  const message = msg.messages[0];
  console.debug(message);
  if (!message.message || message.key.fromMe) return;

  const sender = message.key.remoteJid;
  const text = message.message.conversation ||
        message.message.extendedTextMessage?.text;

  if (text) {
    if (containsSubstring(text.toLocaleLowerCase(), galiMatches)) {
      console.log('The message contains a gaali');
      await addToQueue(sender, getRandomElement(gaali));
    } else {
      console.log('No gaali match found.');
    }
  } else {
    console.log('Not a text message.');
  }
});

const containsSubstring = (message, substrings) => substrings.some(sub => message.includes(sub));

const getRandomElement = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
