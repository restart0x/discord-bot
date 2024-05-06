const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const commandHandlers = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const commandModule = require(`./commands/${file}`);
    commandHandlers[commandModule.name] = commandModule.execute;
}

const handleDiscordMessage = async (message) => {
    if (!message.content.startsWith('/') || message.author.bot) return;
    
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commandHandlers[commandName]) {
        message.reply(`Sorry, I don't recognize that command.`);
        return;
    }
    
    try {
        await commandHandlers[commandName](message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};

module.exports = { processMessage: handleDiscordMessage };