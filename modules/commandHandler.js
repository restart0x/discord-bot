const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const commandExecutors = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commandExecutors[command.name] = command.execute;
}

const handleMessage = async (message) => {
    if (!message.content.startsWith('/') || message.author.bot) return;
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commandExecutors[commandName]) {
        message.reply(`Sorry, I don't recognize that command.`);
        return;
    }
    try {
        await commandExecutors[commandName](message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};

module.exports = { processMessage: handleMessage };