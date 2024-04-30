const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;
  
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'help') {
        message.channel.send('Available Commands: \n!help - Show this message\n!about - Learn about the bot');
    }

    else if (command === 'about') {
        message.channel.send('I am a simple Discord bot built with discord.js. I can respond to basic commands!');
    }
});

client.login(process.env.DISCORD_TOKEN);