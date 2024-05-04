import { Client, GatewayIntentBits, ChannelType } from 'discord.js'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus
} from '@discordjs/voice'

const SOUND_FILE = 'assets/stop-it.mp3'
const MIN_MINUTES_BETWEEN_SOUND = parseInt(process.env.MIN_MINUTES_BETWEEN_SOUND, 10)
const MAX_MINUTES_BETWEEN_SOUND = parseInt(process.env.MAX_MINUTES_BETWEEN_SOUND, 10)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

let timeout

const player = createAudioPlayer()

function playSound() {
  const resource = createAudioResource(SOUND_FILE)
  player.play(resource)
}

function getRandomIntegerBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function queueSoundPlayback() {
  const ms = getRandomIntegerBetween(MIN_MINUTES_BETWEEN_SOUND, MAX_MINUTES_BETWEEN_SOUND) * 60 * 1000
  timeout = setTimeout(playSound, ms)
}

player.on('stateChange', (oldState, newState) => {
  if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
    queueSoundPlayback()
  }
})

client.on('voiceStateUpdate', async (oldState, newState) => {
  const oldUser = oldState.member.user
  const oldVoiceChannel = oldState.channel
  const newUser = newState.member.user
  const newVoiceChannel = newState.channel
  const { guild } = newState

  if (newUser.bot || oldUser.bot || newVoiceChannel === oldVoiceChannel) return

  const voiceChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice)

  const largestChannel = voiceChannels.reduce((currentMax, channel) => {
    const members = channel.members.filter(member => !member.user.bot)

    return !currentMax || members.size > currentMax.members.filter(member => !member.user.bot).size
      ? channel
      : currentMax
  }, null)

  const isBotOnlyOneInChannel = !!largestChannel && !largestChannel.members.filter(member => !member.user.bot).size
  if (isBotOnlyOneInChannel) {
    const connection = getVoiceConnection(guild.id)
    connection?.destroy()
    clearTimeout(timeout)
    timeout = null
  } else {
    try {
      const connection = joinVoiceChannel({
        channelId: largestChannel.id,
        guildId: largestChannel.guild.id,
        adapterCreator: largestChannel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
      })
      connection.subscribe(player)
      if (!timeout) queueSoundPlayback()
    } catch (e) {
      // do nothing
    }
  }
})

client.on('messageCreate', async ({ content, channel, mentions }) => {
  if (content.toLowerCase() === 'sup frank') {
    await channel.send({ content: 'sup dude' })
  } else if (content.toLowerCase() === 'bye frank') {
    await channel.send({ content: 'see ya' })
  } else if (mentions.members.some(member => member.id === process.env.BOT_ID)) {
    await channel.send({
      files: [{
        attachment: 'assets/tip.jpg',
        name: 'tip.jpg'
      }]
    })
  }
})

async function loadBot() {
  try {
    await client.login(process.env.TOKEN)
    console.log('Started')
  } catch (error) {
    console.error(error)
    client.destroy()
    process.exit(1)
  }
}

loadBot()
