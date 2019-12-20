const crypto = require('crypto');
const secret = require('config.json').SECRET;

const encrypt = string => {
  return new Promise((resolve, reject) => {
    let cipher = crypto.createCipheriv(secret.algorithm, Buffer.from(secret.key, 'hex'), Buffer.from(secret.iv, 'hex'));
    let encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    resolve(encrypted);
  });
}

const decrypt = data => {
  return new Promise((resolve, reject) => {
    let encrypted = Buffer.from(data, 'hex');
    let decipher = crypto.createDecipheriv(secret.algorithm, Buffer.from(secret.key, 'hex'), Buffer.from(secret.iv, 'hex'));
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    resolve(decrypted.toString());
  })
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;