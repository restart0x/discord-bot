const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

discordClient.commandsRegistry = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const commandFile of commandFiles) {
    const commandModule = require(`./commands/${commandFile}`);
    discordClient.commandsRegistry.set(commandModule.name, commandModule);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const eventFile of eventFiles) {
    const eventModule = require(`./events/${eventFile}`);
    if (eventModule.once) {
        discordClient.once(eventModule.name, (...args) => eventModule.execute(...args, discordClient));
    } else {
        discordClient.on(eventModule.name, (...args) => eventModule.execute(...args, discordClient));
    }
}

discordClient.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const commandArgs = message.content.slice(1).trim().split(/ +/);
    const commandName = commandArgs.shift().toLowerCase();

    const commandToExecute = discordClient.commandsRegistry.get(commandName) 
        || discordClient.commandsRegistry.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!commandToExecute) return;

    try {
        commandToExecute.execute(message, commandArgs, discordClient);
    } catch (executionError) {
        console.error('Error executing command:', executionError);
        message.reply('There was an error trying to execute that command!');
    }
});

discordClient.on('error', (discordError) => console.error('The client encountered an error:', discordError));

discordClient.login(process.env.DISCORD_TOKEN);