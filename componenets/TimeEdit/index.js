import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import TimeDigitEdit from '../TimeDigitEdit';

import styles from './styles';

const TimeEdit = ({ time, handleUpdate }) => {
  const [minutes, setMinutes] = useState(parseInt(time.slice(0, 2)));
  const [seconds, setSeconds] = useState(parseInt(time.slice(-2)));

  useEffect(
    () => handleUpdate(`${minutes.toString()}:${seconds.toString()}`),
    [minutes, seconds]
  );

  const handleMinutesChange = (newMinutes) => {
    if (newMinutes > 99)
      setMinutes(newMinutes - 100)
    else if (newMinutes < 0) {
      setMinutes(newMinutes + 100)
    } else
      setMinutes(newMinutes)
  }

  const handleSecondsChange = (newSeconds) => {
    if (newSeconds > 59) {
      setSeconds(newSeconds - 60)
      handleMinutesChange(minutes + 1)
    } else if (newSeconds < 0) {
      setSeconds(newSeconds + 60)
      handleMinutesChange(minutes - 1)
    } else
      setSeconds(newSeconds)
  }

  return (
    <View style={styles.timeWrapper}>
      <TimeDigitEdit
        digit={Math.floor(minutes / 10)}
        handleUpdate={(newDigit) => handleMinutesChange(newDigit * 10 + (minutes % 10))}
      />
      <TimeDigitEdit
        digit={minutes % 10}
        handleUpdate={(newDigit) =>
          handleMinutesChange(Math.floor(minutes / 10) * 10 + newDigit)
        }
      />
      <Text>:</Text>
      <TimeDigitEdit
        digit={Math.floor(seconds / 10)}
        handleUpdate={(newDigit) => handleSecondsChange(newDigit * 10 + (seconds % 10))}
      />
      <TimeDigitEdit
        digit={seconds % 10}
        handleUpdate={(newDigit) =>
          handleSecondsChange(Math.floor(seconds / 10) * 10 + newDigit)
        }
      />
    </View>
  );
};

export default TimeEdit;
