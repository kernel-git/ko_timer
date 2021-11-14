import React from 'react';
import { Text, View } from 'react-native';
import ButtonBadge from '../ButtonBadge';

import styles from './styles';

const TimeDigitEdit = ({ digit, handleUpdate }) => (
  <View style={styles.digitWrapper}>
    <ButtonBadge
      badgeType="arrowUp"
      handlePress={() => handleUpdate(digit + 1)}
      extraStyle={styles.arrowUpper}
      size={30}
    />
    <Text style={styles.digit}>{digit}</Text>
    <ButtonBadge
      badgeType="arrowDown"
      handlePress={() => handleUpdate(digit - 1)}
      extraStyle={styles.arrowLower}
      size={30}
    />
  </View>
);

export default TimeDigitEdit;
