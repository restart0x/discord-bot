const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

    if (commandName === 'help') {
        message.channel.send('Available Commands: \n!help - Show this message\n!about - Learn about the bot\n!ping - Check bot latency');
    } else if (commandName === 'about') {
        message.channel.send('I am a simple Discord bot built with discord.js. I can respond to basic commands!');
    }
});

client.login(process.env.DISCORD_TOKEN);
```
```javascript
module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong!').then(sent => {
            const timeDiff = (sent.createdTimestamp - message.createdTimestamp);
            sent.edit(`Pong! Latency is ${timeDiff}ms.`);
        });
    },
};