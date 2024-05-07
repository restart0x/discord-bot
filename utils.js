require('dotenv').config();

const logLevels = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
};

const log = (message, level = logLevels.INFO) => console.log(`[${new Date().toISOString()}][${level}] ${message}`);

const logError = (error, message = 'An error occurred', details = '') => {
    const detailMessage = details ? ` Details: ${details}` : '';
    console.error(`[${new Date().toISOString()}][ERROR] ${message}:${detailMessage}`, error);
};

const enhancedLog = (message, level = logLevels.INFO) => {
    switch (level) {
        case logLevels.DEBUG:
        case logLevels.INFO:
        case logLevels.WARNING:
            log(message, level);
            break;
        case logLevels.ERROR:
            logError(new Error(message), message);
            break;
        default:
            log(`Unhandled log level: ${level}. Message: ${message}`);
    }
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
    enhancedLog,
    safeJSONParse,
    checkEnvVariable,
    sleep,
    withErrorLogging,
    logLevels 
};