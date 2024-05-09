require('dotenv').config();

const bannedWords = process.env.FORBIDDEN_WORDS.split(',');

const spamDetectionPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

const userWarningsCount = {};

function inspectMessageContent(message) {
    const containsBannedWord = bannedWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(message));
    if (containsBannedWord) return 'forbidden';

    const isIdentifiedAsSpam = spamDetectionPatterns.some(pattern => pattern.test(message));
    if (isIdentifiedAsSpam) return 'spam';

    return null;
}

function issueWarningToUser(userId) {
    console.log(`User ${userId} has been warned.`);
    if (!userWarningsCount[userId]) {
        userWarningsCount[userId] = 1;
    } else {
        userWarningsCount[userId]++;
    }
    if (userWarningsCount[userId] >= 3) {
        executeBanOnUser(userId);
        userWarningsCount[userId] = 0;
    }
}

function removeMessage(messageId) {
    console.log(`Message ${messageId} has been deleted.`);
}

function executeBanOnUser(userId) {
    console.log(`User ${userId} has been banned.`);
}

function evaluateAndActOnMessage(userId, messageId, message) {
    switch (inspectMessageContent(message)) {
        case 'forbidden':
            removeMessage(messageId);
            issueWarningToUser(userId);
            break;
        case 'spam':
            removeMessage(messageId);
            executeBanOnUser(userId);
            break;
    }
}

module.exports = {
    moderateMessage: evaluateAndActOnMessage,
};