require('dotenv').config();
const axios = require('axios'); // Ensure you have axios installed for HTTP requests

const bannedWords = process.env.FORBIDDEN_WORDS.split(',');

const spamDetectionPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

const userWarningsCount = {};
const userCoolOffPeriod = {};

// Sentiment Analysis API Endpoint (replace with a real endpoint or service you intend to use)
const sentimentAnalysisAPI = process.env.SENTIMENT_ANALYSIS_API;

async function checkSentiment(message) {
    try {
        const { data } = await axios.post(sentimentAnalysisAPI, { text: message });
        return data; // Assume API returns { sentiment: 'positive' | 'negative' | 'neutral' }
    } catch (error) {
        console.error('Sentiment analysis failed', error);
        return { sentiment: 'neutral' }; // Default to neutral on failure
    }
}

function inspectMessageContent(message) {
    const containsBannedWord = bannedWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(message));
    if (containsBannedWord) return 'forbidden';

    const isIdentifiedAsSpam = spamDetectionPatterns.some(pattern => pattern.test(message));
    if (isIdentifiedAsSpam) return 'spam';

    return 'checkSentiment'; // Additional check needed
}

async function issueWarningToUser(userId) {
    console.log(`User ${userId} has been warned.`);
    if (!userWarningsCount[userId]) {
        userWarningsCount[userId] = 1;
    } else {
        userWarningsCount[userId]++;
    }
    if (userWarningsCount[userId] >= 3) {
        executeBanOnUser(userId);
        userWarningsCount[userId] = 0;
    } else {
        // Setting a cooling-off period of 60 seconds (60000 milliseconds)
        userCoolOffPeriod[userId] = Date.now() + 60000;
    }
}

function removeMessage(messageId) {
    console.log(`Message ${messageId} has been deleted.`);
}

function executeBanOnUser(userId) {
    console.log(`User ${userId} has been banned.`);
}

async function evaluateAndActOnMessage(userId, messageId, message) {
    if (userCoolOffPeriod[userId] && Date.now() < userCoolOffPeriod[userId]) {
        // Ignore messages from users in their cooling-off period
        console.log(`User ${userId} is in cooling off period. Message ignored.`);
        return;
    }

    let evaluationResult = inspectMessageContent(message);

    if (evaluationResult === 'checkSentiment') {
        const sentimentResult = await checkSentiment(message);
        evaluationResult = sentimentResult.sentiment === 'negative' ? 'forbidden' : null;
    }

    switch (evaluationResult) {
        case 'forbidden':
            removeMessage(messageId);
            await issueWarningToUser(userId);
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