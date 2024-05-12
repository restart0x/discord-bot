require('dotenv').config();
const axios = require('axios');

const bannedWords = process.env.FORBIDDEN_WORDS.split(',');

const spamDetectionPatterns = [
    /\b(?:free|click here|buy now)\b/i,
    /(.)\1{4,}/,
];

const userWarningsCount = {};
const userCoolOffPeriod = {};
const sentimentCache = {}; // Cache for sentiment analysis

const sentimentAnalysisAPI = process.env.SENTIMENT_ANALYSIS_API;

async function checkSentiment(message) {
    // Use the message as the cache key
    const cacheKey = message.toLowerCase().trim();
    if (sentimentCache[cacheKey]) {
        console.log('Fetching result from cache for:', message);
        return sentimentCache[cacheKey]; // Return cached sentiment if available
    }
    try {
        const { data } = await axios.post(sentimentAnalysisAPI, { text: message });
        // Store the result in cache for future use
        sentimentCache[cacheKey] = data;
        return data;
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
        userCoolOffPeriod[userId] = Date.now() + 60000; // 60 seconds cooling-off period
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