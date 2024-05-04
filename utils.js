require('dotenv').config();

const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);

const logError = (error, message = 'An error occurred', details = '') => {
    const detailMessage = details ? ` Details: ${details}` : '';
    console.error(`[${new Date().toISOString()}] ${message}:${detailMessage}`, error);
};

const safeJSONParse = (str) => {
    try {
        return [null, JSON.parse(str)];
    } catch (error) {
        return [new Error(`Failed to parse JSON string. Original error: ${error.message}`)];
    }
};

const checkEnvVariable = (varName) => {
    if (!process.env[varName]) {
        logError(new Error(`MissingEnvVar`), `Environment variable '${varName}' is not set. Ensure it is declared in your environment.`);
        return false;
    }
    return true;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function withErrorLogging(fn) {
    try {
        await fn();
    } catch (error) {
        logError(error, `Error executing async function '${fn.name}'.`);
    }
}

module.exports = {
    log,
    logError,
    safeJSONParse,
    checkEnvVariable,
    sleep,
    withErrorLogging
};