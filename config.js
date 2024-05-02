require('dotenv').config();

// Check for the presence of BOT_TOKEN in the environment variables
if (!process.env.BOT_TOKEN) {
  console.error("ERROR: The BOT_TOKEN environment variable is not set.");
  process.exit(1); // Exit the process with an error code
}

module.exports = {
  botToken: process.env.BOT_TOKEN,
  prefix: process.env.PREFIX || "!", // Use "!" as the default prefix if none is provided
};