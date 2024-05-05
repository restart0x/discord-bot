require('dotenv').config();

const forbiddenWords = process.env.FORBIDDEN_WORDS.split(',');

const spamPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

function checkMessage(message) {
    const hasForbiddenWord = forbiddenWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(message));
    if (hasForbiddenWord) return 'forbidden';

    const isSpam = spamPatterns.some(pattern => pattern.test(message));
    if (isSpam) return 'spam';

    return null;
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
    switch (checkMessage(message)) {
        case 'forbidden':
            deleteMessage(messageId);
            warnUser(userId);
            break;
        case 'spam':
            deleteMessage(messageId);
            banUser(userId);
            break;
    }
}

module.exports = {
    moderateMessage,
};