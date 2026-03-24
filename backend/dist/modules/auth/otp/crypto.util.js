"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto = require("crypto");
const ALGORITHM = 'aes-256-gcm';
function getKey() {
    const key = process.env.OTP_ENCRYPTION_KEY || 'default-dev-key-change-in-production!!';
    return crypto.createHash('sha256').update(key).digest();
}
function encrypt(text) {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}
function decrypt(encryptedText) {
    const key = getKey();
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
//# sourceMappingURL=crypto.util.js.map