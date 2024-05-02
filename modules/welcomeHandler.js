require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
  const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
  const rulesChannelId = process.env.RULES_CHANNEL_ID;
  const serverName = member.guild.name;

  let welcomeMessage = `Welcome ${member.user.username} to **${serverName}**! We're so glad to have you here. 🎉`;
  welcomeMessage += `\nPlease make sure to check out our ${member.guild.channels.cache.get(rulesChannelId).toString()} and feel free to ask any questions.`;
  welcomeMessage += `\nIn this server, you can... <Explain functionalities>.`;

  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
  
  if (welcomeChannel) {
    welcomeChannel.send(welcomeMessage);
  } else {
    console.error('Welcome channel not found. Please check your WELCOME_CHANNEL_ID in the .env file.');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);