const Discord = require('discord.js')
const { token } = require('./config.json')

const client = new Discord.Client()

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
  } else {
    await largestChannel.join()
  }
})

client.on('message', async ({ content, channel }) => {
  if (content.toLowerCase() === 'sup frank') {
    await channel.send('sup dude')
  }
})