const INITIAL_SOUND_FILE = 'assets/fbi-open-up.mp3'
const SOUND_FILES = ['assets/stop-it.mp3', INITIAL_SOUND_FILE]

module.exports = {
  initialSoundFile: INITIAL_SOUND_FILE,
  getRandomSoundFile: () => SOUND_FILES[Math.floor(Math.random() * SOUND_FILES.length)]
}
