'use strict';

const {
  tryDelete
} = require('../../lib/discordjs-utils');
const {
  getShortcut
} = require('../../lib/shortcuts');

let fullMessage = '';

const info = {
  name: 'Gif',
  command: 'gif',
  args: 'type *',
  description: 'Send all emojis one after the other'
};

const action = async (message, args) => {
  const type = args[0];
  const reaction = getShortcut(message.author.id, type);
  if (reaction) {
    const emojis = reaction.emojis;
    // const messages = await message.channel.messages.fetch({ limit: 2 });
    const gifMessage = await message.channel.send(emojis[0]);
    fullMessage += message.author.toString() + ' : ' + emojis[0] + ' ';
    tryDelete(message);
    for (let i = 1; i < emojis.length; i++) {
      gifMessage.author.client.setTimeout(() => {
        updateGif(gifMessage, emojis[i]);
      }, process.env.GIF_TIMER * i);
      fullMessage += emojis[i] + ' ';
    }
    gifMessage.author.client.setTimeout(() => {
      updateGif(gifMessage, fullMessage);
    }, process.env.GIF_TIMER * emojis.length);
  }
};

const updateGif = (message, emoji) => {
  message.edit(emoji);
};

module.exports = {
  info,
  action
};
