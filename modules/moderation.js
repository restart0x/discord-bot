require('dotenv').config();

const forbiddenWords = process.env.FORBIDDEN_WORDS.split(',');

const spamPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

function containsForbiddenWords(message) {
    return forbiddenWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(message));
}

function isSpam(message) {
    return spamPatterns.some(pattern => pattern.test(message));
}

function warnUser(userId) {
    console.log(`User ${userId} has been warned.`);
}

function deleteMessage(messageId) {
    console.log(`Message ${messageId} has been deleted.`);
}

function banUser(userId) {
    console.log(`User ${userId} has been banned.`);
}

function moderateMessage(userId, messageId, message) {
    if (containsForbiddenWords(message)) {
        deleteMessage(messageId);
        warnUser(userId);
    } else if (isSpam(message)) {
        deleteMessage(messageId);
        banUser(userId);
    }
}

module.exports = {
    moderateMessage,
};