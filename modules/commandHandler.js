const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const commandHandlers = new Map();

fs.readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
      const commandModule = require(path.join(commandsPath, file));
      commandHandlers.set(commandModule.name, commandModule.execute);
  });

const handleDiscordMessage = async (message) => {
    if (!message.content.startsWith('/') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const [commandName, ...restArgs] = args;
    const command = commandHandlers.get(commandName.toLowerCase());

    if (!command) {
        message.reply(`Sorry, I don't recognize that command.`);
        return;
    }
    
    try {
        await command(message, restArgs);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};

module.exports = { processMessage: handleDiscordMessage };