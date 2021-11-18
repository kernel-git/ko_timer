import Sound from 'react-native-sound';

export const getSound = (name) => {
  const path = `${name}.mp3`;
  return new Sound(path, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log(`failed to load the sound on ${path}`);
      console.log(error);
      return null;
    }
  });
};

export const playSound = (sound) =>
  sound.play((success) => {
    if (!success) {
      console.log('Sound did not play');
    }
  });
