require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', (member) => {
  const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
  const rulesChannelId = process.env.RULES_CHANNEL_ID;
  const serverName = member.guild.name;

  try {
    if (!welcomeChannelId || !rulesChannelId) {
      throw new Error('Channel IDs are not configured correctly in the .env file.');
    }

    const rulesChannel = member.guild.channels.cache.get(rulesChannelId);
    if (!rulesChannel) {
      throw new Error('Rules channel not found. Please check your RULES_CHANNEL_ID in the .env file.');
    }

    let welcomeMessage = `Welcome ${member.user.username} to **${serverName}**! We're so glad to have you here. 🎉`;
    welcomeMessage += `\nPlease make sure to check out our ${rulesChannel.toString()} and feel free to ask any questions.`;
    welcomeMessage += `\nIn this server, you can... <Explain functionalities>.`;

    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    if (!welcomeChannel) {
      throw new Error('Welcome channel not found. Please check your WELCOME_CHANNEL_ID in the .env file.');
    }

    welcomeChannel.send(welcomeMessage).catch((err) => {
      throw new Error(`Failed to send welcome message: ${err.message}`);
    });
  } catch (err) {
    console.error(`An error occurred while trying to send a welcome message: ${err.message}`);
  }
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  try {
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'role') {
      if (args.length > 0) {
        const roleName = args.join(' ');
        const role = message.guild.roles.cache.find((r) => r.name === roleName);

        if (!role) {
          throw new Error(`Role "${roleName}" not found.`);
        }

        if (message.member.roles.cache.has(role.id)) {
          message.reply(`You already have the ${role.name} role.`);
        } else {
          await message.member.roles
            .add(role)
            .then(() => message.reply(`You've been given the ${role.name} role!`))
            .catch((err) => {
              throw new Error(`Could not assign role: ${err.message}`);
            });
        }
      } else {
        throw new Error('No role specified. Please specify the role you want to be assigned to. Usage: `!role <RoleName>`');
      }
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
    message.reply(`${err.message} Please try again or contact an administrator.`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);