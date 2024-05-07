require('dotenv').config();

const forbiddenWords = process.env.FORBIDDEN_WORDS.split(',');

const spamPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

// Store user warnings count
const userWarnings = {};

function checkMessage(message) {
    const hasForbiddenWord = forbiddenWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(message));
    if (hasForbiddenWord) return 'forbidden';

    const isSpam = spamPatterns.some(pattern => pattern.test(message));
    if (isSpam) return 'spam';

    return null;
}

function warnUser(userId) {
    console.log(`User ${userId} has been warned.`);
    // Increment user warning or add first warning
    if (!userWarnings[userId]) {
        userWarnings[userId] = 1;
    } else {
        userWarnings[userId]++;
    }
    // Check if warnings threshold exceeded
    if (userWarnings[userId] >= 3) { // Threshold of 3 warnings before ban
        banUser(userId);
        // Reset warnings count after ban
        userWarnings[userId] = 0;
    }
}

function deleteMessage(messageId) {
    console.log(`Message ${messageId} has been deleted.`);
}

function banUser(userId) {
    console.log(`User ${userId} has been banned.`);
    // Consider resetting warning count on ban, or leave as is if you want to track post-ban warnings.
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