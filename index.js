import { REST, Routes, Client, GatewayIntentBits, ApplicationCommandType  } from 'discord.js';
import {config} from 'dotenv'

config()

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'spam',
    description: 'Spam the selected User',
    options: {
      name: 'op1',
      description: 'op1'
    }
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  console.log(message.content)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'spam') {
    interaction.reply('spamming')
    const args = interaction.command;
    console.log(interaction)
    client.channels.fetch(interaction.channelId).then(channel => {
      channel.send('Hey')
    }).catch(() => interaction.reply('error'))

  }
}); 



client.login(process.env.DISCORD_TOKEN);
