const Discord = require('discord.js')
const { token, botId } = require('./config.json')

const client = new Discord.Client()
let timeout

client.login(token)
  .then(() => console.log('Started'))

client.on('error', console.error)

client.on('voiceStateUpdate', async (oldState, newState) => {
  const oldUser = oldState.member.user
  const oldVoiceChannel = oldState.channel
  const newUser = newState.member.user
  const newVoiceChannel = newState.channel
  const guild = newState.guild

  if (newUser.bot || oldUser.bot || newVoiceChannel === oldVoiceChannel) return

  const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'voice')

  const largestChannel = voiceChannels.reduce((currentMax, channel) => {
    let members = channel.members.filter(member => !member.user.bot)

    return !currentMax || members.size > currentMax.members.filter(member => !member.user.bot).size
      ? channel
      : currentMax
  }, null)

  const isBotOnlyOneInChannel = !!largestChannel && !largestChannel.members.filter(member => !member.user.bot).size
  if (isBotOnlyOneInChannel && guild.voice.channel) {
    guild.voice.channel.leave()
    clearTimeout(timeout)
    timeout = null
  } else {
    try {
      await largestChannel.join()
      if (!timeout) queueSoundPlayback()
    } catch (e) {
      // do nothing
    }
  }
})

client.on('message', async ({ content, channel, mentions }) => {
  if (content.toLowerCase() === 'sup frank') {
    await channel.send('sup dude')
  } else if (content.toLowerCase() === 'bye frank') {
    await channel.send('see ya')
  } else if (mentions.members.some(member => member.id === botId)) {
    await channel.send('', {
      files: [{
        attachment: 'assets/tip.jpg',
        name: 'tip.jpg'
      }]
    })
  }
})

function playSound() {
  client.voice.connections.forEach(connection => {
    const dispatcher = connection.play('assets/stop-it.mp3')
    dispatcher.on('finish', queueSoundPlayback)
  })
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function queueSoundPlayback() {
  const ms = getRandomNumberBetween(30, 90) * 60 * 1000
  timeout = setTimeout(playSound, ms)
}