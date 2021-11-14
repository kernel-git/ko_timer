import React from 'react';
import { Pressable } from 'react-native';
import { getBadge } from '../../utils/badge_types';

import styles from './styles';

const ButtonBadge = ({ handlePress, badgeType, extraStyle, size }) => {
  return (
    <Pressable
      className={extraStyle ? [extraStyle, styles.buttonWrapper] : styles.buttonWrapper}
      onPress={handlePress}
    >
      {getBadge(badgeType, size)}
    </Pressable>
  )
}

export default ButtonBadge;
