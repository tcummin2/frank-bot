const Discord = require('discord.js')
const { token, botId } = require('./config.json')

const client = new Discord.Client()
let timeout

client.login(token)
  .then(() => console.log('Started'))

client.on('error', console.error)

client.on('voiceStateUpdate', async (oldGuildMember, newGuildMember) => {
  const { user: oldUser, voiceChannel: oldVoiceChannel } = oldGuildMember
  const { guild, user: newUser, voiceChannel: newVoiceChannel } = newGuildMember

  if (newUser.bot || oldUser.bot || newVoiceChannel === oldVoiceChannel) return

  const voiceChannels = guild.channels.filter(channel => channel.type === 'voice')

  const largestChannel = voiceChannels.reduce((currentMax, channel) => {
    let members = channel.members.filter(member => !member.user.bot)

    return !currentMax || members.size > currentMax.members.filter(member => !member.user.bot).size
      ? channel
      : currentMax
  }, null)

  const isBotOnlyOneInChannel = !!largestChannel && !largestChannel.members.filter(member => !member.user.bot).size
  if (isBotOnlyOneInChannel && guild.voiceConnection) {
    guild.voiceConnection.disconnect()
    clearTimeout(timeout)
    timeout = null
  } else {
    await largestChannel.join()
    if (!timeout) queueSoundPlayback()
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
  client.voiceConnections.forEach(connection => {
    const dispatcher = connection.playFile('assets/stop-it.mp3')
    dispatcher.on('end', queueSoundPlayback)
  })
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function queueSoundPlayback() {
  const ms = getRandomNumberBetween(30, 90) * 60 * 1000
  timeout = setTimeout(playSound, ms)
}