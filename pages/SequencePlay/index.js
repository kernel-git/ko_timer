import React, { useCallback, useEffect, useRef, useState } from 'react';
import ButtonBadge from '../../componenets/ButtonBadge';
import BackgroundTimer from 'react-native-background-timer';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  Text,
  View,
} from 'react-native';

import styles from './styles';
import PageHeader from '../../componenets/PageHeader';
import debounce from 'lodash/debounce';
import { getSequence } from '../../utils/async_storage';
import useDebounce from '../../utils/use_debounce';
import Sound from 'react-native-sound';
import { getSound, playSound } from '../../utils/get_sound';

const SequencePlayPage = ({ route, navigation }) => {
  const { sequenceId } = route.params;

  const portraitWidth = Dimensions.get('window').width;
  const badgeSize = 200;
  const gap = 10;

  const [scrollRef, setScrollRef] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [sequenceData, setSequenceData] = useState({
    id: 0,
    name: '',
    color: '',
    phases: [],
  });

  /*
    Короче этот state нужен для того, чтобы убирать звуки с useEffect если сдвиг на фазу
    был вызван таймером, а не юзером. Т.к useEffect срабатывает сразу все разы после 
    сворачивания / разворачивания приложения, этот state - число, а не boolean.
  */
  const [phaseMovedByTimerCount, setPhaseMovedByTimerCount] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    getSequence(
      sequenceId,
      (data) => {
        setSequenceData(data);
        setCurrentPhaseIndex(0);

        setIsLoading(false);
      },
      (e) => {
        setSequenceData({});
        setCurrentPhaseIndex(-1);
        setIsLoading(false);
        setError(true);
        console.warn('exception', e);
      }
    );
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(301);

  const handleMomentumScrollEndDebounced = (event) => {
    if (!isLoading && !error) {
      let phaseIndex = Math.floor(
        event.nativeEvent.contentOffset.x / (badgeSize + 2 * gap)
      );
      phaseIndex = phaseIndex < 0 ? 0 : phaseIndex;
      phaseIndex =
        phaseIndex > sequenceData.phases.length - 1
          ? sequenceData.phases.length - 1
          : phaseIndex;
      setCurrentPhaseIndex(phaseIndex);
    }
  };

  const debouncedCurrentPhaseIndex = useDebounce(currentPhaseIndex, 200);
  useEffect(() => {
    console.log('New phase', debouncedCurrentPhaseIndex);
    if (debouncedCurrentPhaseIndex !== -1) {
      if (isPlaying) {
        if (phaseMovedByTimerCount === 0) playSound(transitionSound);
        else setPhaseMovedByTimerCount(phaseMovedByTimerCount - 1);
      }

      const timeArr = sequenceData.phases[debouncedCurrentPhaseIndex].time
        .split(':')
        .map((e) => parseInt(e, 10));
      setSecondsLeft(timeArr[0] * 60 + timeArr[1]);
      console.log(timeArr[0] * 60 + timeArr[1]);
    }
  }, [debouncedCurrentPhaseIndex]);

  const debouncedIsPlaying = useDebounce(isPlaying, 200);
  useEffect(() => {
    if (debouncedIsPlaying) startTimer();
    else stopTimer();
  }, [debouncedIsPlaying]);

  const [transitionSound, setTransitionSound] = useState(null);
  const [endSound, setEndSound] = useState(null);
  useEffect(() => {
    Sound.setCategory('Playback');
    setTransitionSound(getSound('ding'));
    setEndSound(getSound('ding_ding_ding'));

    return () => {
      stopTimer();
      if (transitionSound) transitionSound.release();
      if (endSound) endSound.release();
    };
  }, []);

  const stopTimer = () => {
    console.log('stopped');
    BackgroundTimer.stopBackgroundTimer();
  };

  const startTimer = () => {
    console.log('started');
    BackgroundTimer.stopBackgroundTimer();
    BackgroundTimer.runBackgroundTimer(() => {
      if (isPlaying) {
        setSecondsLeft((seconds) => {
          console.log('ping');
          setCurrentPhaseIndex((phaseIndex) => {
            console.log('inside inside phase index', phaseIndex);
            console.log('inside inside seconds', seconds);
            return phaseIndex;
          });
          if (seconds > 1) return seconds - 1;
          else {
            /* Внутри коллбека setState1 я не могу получить доступ к up-to-date версии state2,
            но могу получать up-to-date state1 и state2 внутри коллбека setState2 внутри 
            коллбека setState1. Це реально мерзость.
            */
            setCurrentPhaseIndex((phaseIndex) => {
              if (phaseIndex === sequenceData.phases.length - 1) {
                stopTimer();
                setIsPlaying(false);
                playSound(endSound);
                // console.log('END SOUND')
                return phaseIndex;
              } else {
                scrollRef.scrollTo({
                  x: (phaseIndex + 1) * (gap + gap + badgeSize),
                  y: 0,
                  animated: true,
                });
                console.log('current phase index', phaseIndex);

                const timeArr = sequenceData.phases[phaseIndex + 1].time
                  .split(':')
                  .map((e) => parseInt(e, 10));
                setSecondsLeft(timeArr[0] * 60 + timeArr[1]);
                console.log(timeArr[0] * 60 + timeArr[1]);

                // console.log('TRANSITION SOUND');
                playSound(transitionSound);
                setPhaseMovedByTimerCount((count) => count + 1);

                return phaseIndex + 1;
              }
            });

            return 0;
          }
        });
        // console.log('secondsLeft', secondsLeft)
        // if (secondsLeft <= 0)
        //   setCurrentPhaseIndex((phaseIndex) => {
        //     if (phaseIndex === sequenceData.phases.length - 1) {
        //       stopTimer(endSound);
        //       setIsPlaying(false);
        //       return phaseIndex;
        //     } else {
        //       scrollRef.scrollTo({
        //         x: (phaseIndex + 2) * (gap + gap + badgeSize),
        //         y: 0,
        //         animated: true,
        //       });
        //       console.log('current phase index', phaseIndex);

        //       const timeArr = sequenceData.phases[phaseIndex + 1].time
        //         .split(':')
        //         .map((e) => parseInt(e, 10));
        //       setSecondsLeft(timeArr[0] * 60 + timeArr[1]);
        //       console.log(timeArr[0] * 60 + timeArr[1]);

        //       console.log('SOUND');

        //       return phaseIndex + 1;
        //     }
        //   });
      }
    }, 1000);
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const clockify = (secondsLeft) => {
    return `${formatTime(Math.floor(secondsLeft / 60))} : ${formatTime(
      secondsLeft % 60
    )}`;
  };

  return (
    <View style={styles.wrapper}>
      <PageHeader
        color="blue"
        leftComponent={
          <ButtonBadge
            badgeType="arrowBack"
            handlePress={() => navigation.goBack()}
            size={60}
          />
        }
        titleComponent={
          isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <View style={styles.sequenceWrapper}>
              <ButtonBadge
                badgeType="info"
                handlePress={() => console.log(`badge clicked`)}
                size={40}
              />
              <Text style={{ fontSize: 24 }}>{sequenceData.name}</Text>
            </View>
          )
        }
        rightComponent={
          <ButtonBadge
            badgeType="edit"
            handlePress={() =>
              navigation.navigate('SequenceEdit', { sequenceId })
            }
            size={60}
          />
        }
      />

      <View style={styles.contentWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : error ? (
          <Text>Data is not loaded correctly</Text>
        ) : (
          <>
            <Text style={styles.timeText}>{clockify(secondsLeft)}</Text>
            <View style={styles.phasesWrapper}>
              <ScrollView
                ref={(ref) => {
                  setScrollRef(ref);
                }}
                style={{ maxHeight: badgeSize }}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: (portraitWidth - badgeSize - 2 * gap) / 2,
                }}
                horizontal={true}
                snapToInterval={badgeSize + 2 * gap}
                snapToAlignment="center"
                onMomentumScrollEnd={handleMomentumScrollEndDebounced}
              >
                {sequenceData.phases.map((phase) => (
                  <View key={phase.id} style={{ paddingHorizontal: gap }}>
                    <ButtonBadge
                      badgeType={phase.badge}
                      handlePress={() => setIsPlaying(!isPlaying)}
                      size={badgeSize}
                    />
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.phaseName}>
                {sequenceData.phases[currentPhaseIndex]?.name}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default SequencePlayPage;
