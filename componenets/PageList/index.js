import React from 'react';
import { ScrollView, View } from 'react-native';

import styles from './styles';

const PageList = ({ color, children }) => (
  <ScrollView
    contentContainerStyle={styles.listWrapper}
    style={{ backgroundColor: color, flex: 1, width: '100%' }}
  >
    {children}
  </ScrollView>
);

export default PageList;
