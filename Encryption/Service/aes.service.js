// eslint-disable-next-line  import/no-unresolved
import crypto from 'node:crypto';

import getError from '#utils/error.js';

const secretKey = 'saranshbalyan123saranshbalyan123';
const initializationVector = 'c3e84932d4eca8d8860e087613ca4313';

// Function to encrypt using AES CBC
const encryptWithAES = (text, key = secretKey, iv = initializationVector) => {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
    let encrypted = cipher.update(JSON.stringify(text), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted };
  } catch (e) {
    getError(e);
  }
};

// Function to decrypt using AES CBC
const decryptWithAES = (encryptedText, key = secretKey, iv = initializationVector) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
  } catch (e) {
    getError(e);
  }
};

/*
 * Const plaintext = "Hello, AES CBC encryption!";
 * const encryptedText = encryptWithAES(plaintext, secretKey,initializationVector );
 * console.log("Encrypted:",encryptedText);
 */

/*
 * Const decryptedText = decryptWithAES("8600ce43592fecadc5b8edba44f0e81a", secretKey, initializationVector);
 * console.log("Decrypted:", decryptedText);
 */

export { decryptWithAES, encryptWithAES };
