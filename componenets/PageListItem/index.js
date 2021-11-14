import React from 'react';
import { Text, View } from 'react-native';
import ButtonBadge from '../ButtonBadge';

import styles from './styles';

const PageListItem = ({
  color,
  leftButton,
  labelComponent,
  extraLabel,
  middleButton,
  rightButton,
}) => (
  <View
    style={
      color
        ? [styles.itemWrapper, { backgroundColor: color }]
        : styles.itemWrapper
    }
  >
    {leftButton && (
      <ButtonBadge
        badgeType={leftButton.badgeType}
        handlePress={leftButton.handlePress}
        extraStyle={styles.buttonWrapper}
        size={leftButton.size}
      />
    )}
    <View style={styles.labelContainer}>
      <View style={styles.labelWrapper}>
        {labelComponent}
      </View>
      {extraLabel && (
        <View className={styles.extraLabelWrapper}>
          <Text style={styles.extraLabel}>{extraLabel}</Text>
        </View>
      )}
    </View>
    {middleButton && (
      <ButtonBadge
        badgeType={middleButton.badgeType}
        handlePress={middleButton.handlePress}
        extraStyle={styles.buttonWrapper}
        size={middleButton.size}
      />
    )}
    {rightButton && (
      <ButtonBadge
        badgeType={rightButton.badgeType}
        handlePress={rightButton.handlePress}
        extraStyle={styles.buttonWrapper}
        size={rightButton.size}
      />
    )}
  </View>
);

export default PageListItem;
