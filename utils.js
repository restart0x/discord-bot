require('dotenv').config();

const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);

const logError = (error, message = 'An error occurred') => console.error(`[${new Date().toISOString()}] ${message}:`, error);

const safeJSONParse = (str) => {
    try {
        return [null, JSON.parse(str)];
    } catch (error) {
        return [error];
    }
};

const checkEnvVariable = (varName) => {
    if (!process.env[varName]) {
        logError(`Environment variable ${varName} is not set`);
        return false;
    }
    return true;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    log,
    logError,
    safeJSONParse,
    checkEnvVariable,
    sleep
};