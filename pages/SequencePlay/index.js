import React, { useEffect, useState } from 'react';
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
import { debounce } from 'debounce';
import { getSequence } from '../../utils/async_storage';

const SequencePlayPage = ({ route, navigation }) => {
  const { sequenceId } = route.params;

  const portraitWidth = Dimensions.get('window').width;
  const badgeSize = 200;
  const gap = 10;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [sequenceData, setSequenceData] = useState({
    id: 0,
    name: '',
    color: '',
    phases: [],
  });
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    getSequence(
      sequenceId,
      (data) => {
        console.log('onSuccess data', data);
        setSequenceData(data);
        setCurrentPhaseIndex(0);

        setIsLoading(false);
      },
      (e) => {
        setSequenceData({});
        setCurrentPhaseIndex(-1);
        setIsLoading(false);
        setError(true);
        console.log('exception', e);
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

  useEffect(() => {
    if (currentPhaseIndex !== -1) {
      const timeArr = sequenceData.phases[currentPhaseIndex].time
        .split(':')
        .map((e) => parseInt(e, 10));
      setSecondsLeft(timeArr[0] * 60 + timeArr[1]);

      //some code to handle phase change
    }
  }, [currentPhaseIndex]);

  // useEffect(() => {
  //   if (isPlaying) startTimer();
  //     else BackgroundTimer.stopBackgroundTimer();

  //   return () => {
  //     BackgroundTimer.stopBackgroundTimer();
  //   };
  // }, isPlaying);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const clockify = (secondsLeft) =>
    `${formatTime(Math.floor(secondsLeft / 60))} : ${formatTime(
      secondsLeft % 60
    )}`;

  console.log(sequenceData.name);

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
