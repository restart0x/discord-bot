const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const commandHandlers = new Map();
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandModule = require(path.join(commandsPath, file));
    commandHandlers.set(commandModule.name, commandModule.execute);
}

const handleDiscordMessage = async (message) => {
    if (!message.content.startsWith('/') || message.author.bot) return;
    
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commandHandlers.has(commandName)) {
        message.reply(`Sorry, I don't recognize that command.`);
        return;
    }
    
    try {
        await commandHandlers.get(commandName)(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};

module.exports = { processMessage: handleDiscordMessage };