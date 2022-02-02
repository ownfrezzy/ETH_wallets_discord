/* eslint-disable default-case */
require('dotenv').config(); // initialize dotenv
const { Client, Intents } = require('discord.js');
const Web3Utils = require('web3-utils');
const { dbConnect } = require('./config/database');
const { Whitelist } = require('./schemas/whitelist');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

dbConnect();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
  const [user] = await Whitelist.find({
    user: `${msg.author.username}#${msg.author.discriminator}`,
  }).lean();
  const [address] = await Whitelist.find({
    address: `${msg.content.split(' ')[1]}`,
  }).lean();

  switch (msg.content) {
  // |--------------------------------------------------|
  // |__________________________________________________|
  // |__________________________________________________|
  // |_________________!REGISTER________________________|
  // |__________________________________________________|
  // |__________________________________________________|
  // |--------------------------------------------------|

  case msg.content.match(/^!register/)?.input:
    if (!Web3Utils.isAddress(msg.content.split(' ')[1])) {
      msg.reply('Please, paste correct Avalanche C-chain address');
      break;
    }

    if (Web3Utils.isAddress(msg.content.split(' ')[1])) {
      if (user) {
        msg.reply('User already registered');
        break;
      }

      if (address) {
        msg.reply('Address already registered');
        break;
      }

      const newAddress = await Whitelist.create({
        user: `${msg.author.username}#${msg.author.discriminator}`,
        address: msg.content.split(' ')[1],
      });

      msg.author
        .send(
          `Successfully registered:
          ${newAddress.user} => ${newAddress.address}
          `,
        )
        .then(() => {
          msg.reply('Successfully registered, check your DM!');
        })
        .catch(() => msg.reply('Successfully registered'));
    }

    break;

    // |--------------------------------------------------|
    // |__________________________________________________|
    // |__________________________________________________|
    // |_________________!DELETE__________________________|
    // |__________________________________________________|
    // |__________________________________________________|
    // |--------------------------------------------------|

  case msg.content.match(/^!delete/)?.input:
    if (!user) {
      msg.reply('Cant find a user, please !register first');
      break;
    }

    await Whitelist.deleteOne({
      user: `${msg.author.username}#${msg.author.discriminator}`,
    });

    msg.author
      .send(
        `Successfully deleted:
        ${user.user} => ${user.address}
        `,
      )
      .then(() => {
        msg.reply('Wallet successfully deleted, check your DM');
      })
      .catch(() => msg.reply('Wallet successfully deleted'));

    break;

    // |--------------------------------------------------|
    // |__________________________________________________|
    // |__________________________________________________|
    // |_________________!CHECK___________________________|
    // |__________________________________________________|
    // |__________________________________________________|
    // |--------------------------------------------------|

  case msg.content.match(/^!check/)?.input:
    if (!user) {
      msg.reply('Cant find a user, please !register first');
      break;
    }

    msg.author
      .send(
        `Your whitelist information:
        ${user.user} => ${user.address}
        `,
      )
      .then(() => {
        msg.reply('Message successfully sent, check your DM');
      })
      .catch(() => {
        msg.reply('Pleace, open your DM to recieve information');
      });

    break;

    // |--------------------------------------------------|
    // |__________________________________________________|
    // |__________________________________________________|
    // |_________________!HELP____________________________|
    // |__________________________________________________|
    // |__________________________________________________|
    // |--------------------------------------------------|

  case msg.content.match(/^!help/)?.input:
    msg.reply(`List of available commands:
!register <your address>: Registers your wallet as whitelisted (!register 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)
!delete: Delete your wallet from whitelist(use this if you need to change your wallet address)
!check: Check if you already whitelisted or not
!help: List of available commands
      `);

    break;
  }
});

client.login(process.env.CLIENT_TOKEN);
