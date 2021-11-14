import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import ButtonBadge from '../../componenets/ButtonBadge';

import PageHeader from '../../componenets/PageHeader';
import PageList from '../../componenets/PageList';
import PageListItem from '../../componenets/PageListItem';
import { getAllSequences, resetSequences } from '../../utils/async_storage';

import styles from './styles';

const SequenceListPage = ({ navigation }) => {
  const screenHeight = Dimensions.get('window').height;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sequenceData, setSequenceData] = useState([]);

  const [updateFlag, setUpdateFlag] = useState(false);
  const triggerUpdate = () => setUpdateFlag(!updateFlag);

  useEffect(() => triggerUpdate(), []);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    getAllSequences(
      (data) => {
        setSequenceData(data);
        setIsLoading(false);
      },
      (e) => {
        setSequenceData([]);
        setIsLoading(false);
        setError(true);
        console.log('exception', e);
      }
    );
  }, [updateFlag]);

  return (
    <View style={[styles.wrapper, { height: screenHeight }]}>
      <PageHeader
        color="blue"
        leftComponent={
          <ButtonBadge
            badgeType="rockHand"
            handlePress={() => resetSequences(() => triggerUpdate())}
            size={60}
          />
        }
        titleComponent={<Text style={{ fontSize: 24 }}>K.O. timer</Text>}
        rightComponent={
          <ButtonBadge
            badgeType="settings"
            handlePress={() => console.log(`/settings`)}
            size={60}
          />
        }
      />
      <PageList color="skyblue">
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : isEmpty(sequenceData) ? (
          <Text>No sequences yet</Text>
        ) : (
          sequenceData.map(({ id, name, phases, color }) => (
            <PageListItem
              key={id}
              color={color}
              leftButton={{
                handlePress: () =>
                  navigation.navigate('SequencePlay', { sequenceId: id }),
                badgeType: 'play',
                size: 60,
              }}
              labelComponent={<Text style={{ fontSize: 20 }}>{name}</Text>}
              extraLabel={`${phases.length} phases`}
              middleButton={{
                handlePress: () => console.log('Color changed!'),
                badgeType: 'red',
                size: 50,
              }}
              rightButton={{
                handlePress: () =>
                  navigation.navigate('SequenceEdit', { sequenceId: id }),
                badgeType: 'edit',
                size: 60,
              }}
            />
          ))
        )}
        {error && <Text>Error happend while loading data</Text>}
      </PageList>
    </View>
  );
};

export default SequenceListPage;
