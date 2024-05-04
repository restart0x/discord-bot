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

// Command Handler
client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return; // Simple prefix check, adapt if necessary

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Implementing a simple role assignment command
  if (command === 'role') {
    if (args.length > 0) {
      const roleName = args.join(' ');
      const role = message.guild.roles.cache.find(r => r.name === roleName);

      if (role) {
        if (message.member.roles.cache.has(role.id)) {
          message.reply(`You already have the ${role.name} role.`);
        } else {
          await message.member.roles.add(role);
          message.reply(`You've been given the ${role.name} role!`);
        }
      } else {
        message.reply(`Sorry, I couldn't find a role by the name "${roleName}".`);
      }
    } else {
      message.reply('Please specify the role you want to be assigned to. Usage: `!role <RoleName>`');
    }
  }

  // Implement more commands as needed
});

client.login(process.env.DISCORD_BOT_TOKEN);