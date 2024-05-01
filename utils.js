require('dotenv').config();

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

function logError(error, message = 'An error occurred') {
    console.error(`[${new Date().toISOString()}] ${message}:`, error);
}

function safeJSONParse(str) {
    try {
        return [null, JSON.parse(str)];
    } catch (error) {
        return [error];
    }
}

function checkEnvVariable(varName) {
    if (!process.env[varName]) {
        logError(`Environment variable ${varName} is not set`);
        return false;
    }
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    log,
    logError,
    safeJSONParse,
    checkEnvVariable,
    sleep
};