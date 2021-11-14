import React from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

const PageHeader = ({ color, leftComponent, titleComponent, extraTitleComponent, rightComponent }) => (
  <View style={[styles.headerWrapper, { backgroundColor: color }]}>
    {leftComponent}
    <View style={styles.titleContainer}>
      <View style={styles.titleWrapper}>
        {titleComponent}
      </View>
      {extraTitleComponent && (
        <View className={styles.extraTitleWrapper}>
          {extraTitleComponent}
        </View>
      )}
    </View>
    {rightComponent}
  </View>
);

export default PageHeader;
