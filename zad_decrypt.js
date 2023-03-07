const { pipeline } = require('stream').promises;
const { createWriteStream, createReadStream } = require('fs');
const {
  createCipheriv, createDecipheriv, createCipher, createDecipher,
} = require('crypto');
const { promisify } = require('util');
const { SALT } = require('./constants');
const scrypt = promisify(require('crypto').scrypt);
const randomBytes = promisify(require('crypto').randomBytes);

(async () => {
  const [,, inputFile, outputFile, pwd] = process.argv;
  const algorythm = 'aes-192-cbc';

  const key = await scrypt(pwd, SALT, 24);

  const iv = await randomBytes(16);

  await pipeline(
    createReadStream(inputFile),
    createDecipher(algorythm, key),
    createWriteStream(outputFile),
  );
  console.log('Done.');
})();
