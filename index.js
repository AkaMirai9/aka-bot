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
    options: [
      {
        name: 'user',
        description: 'user to spam',
        type: 3,
      },
      {
        name: 'time',
        description: 'time of the spamming',
        type: 3,
      }
    ]
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

    const args = interaction.command;
    console.log(interaction.options.get('user'))
    client.channels.fetch(interaction.channelId).then(channel => {

      const times = interaction.options.get('time').value
      const user = interaction.options.get('user').value

      if (!times || !user) {
        throw Error()
      }
      interaction.reply('Début du Spamming -- Attention à toi ' + interaction.options.get('user').value)
      for (let i = 0; i < parseInt(times); i++) {
        setTimeout(() => {
          channel.send('Hey ' + interaction.options.get('user').value + ' ' + interaction.user.displayName + ' t\'attends')
        }, 5000 * (i + 1))
      }
      setTimeout(() => {
        channel.send('Fin du spamming')
      }, 5010 * times)

    }).catch(() => interaction.reply('error'))

  }
});



client.login(process.env.DISCORD_TOKEN);
