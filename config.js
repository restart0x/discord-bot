require('dotenv').config();

if (!process.env.BOT_TOKEN) {
  console.error("ERROR: The BOT_TOKEN environment variable is not defined.");
  process.exit(1);
}

module.exports = {
  discordBotToken: process.env.BOT_TOKEN,
  commandPrefix: process.env.PREFIX || "!",
};