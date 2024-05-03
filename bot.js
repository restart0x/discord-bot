const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

const fs = require('fs');

try {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
} catch (error) {
    console.error('Error reading command directory:', error);
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
        command.execute(message, args).catch(error => {
            console.error('Error executing command:', error);
            message.reply('there was a problem executing that command.');
        });
    } catch (error) {
        console.error('Error during command execution:', error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.on('error', (error) => {
    console.error('The client encountered an error:', error);
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login:', error);
});