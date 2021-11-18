import React, { useEffect, useState } from 'react';

import styles from './styles';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';
import PageHeader from '../../componenets/PageHeader';
import PageList from '../../componenets/PageList';
import PageListItem from '../../componenets/PageListItem';
import ButtonBadge from '../../componenets/ButtonBadge';
import TimeEdit from '../../componenets/TimeEdit';
import { getSequence, storeSequence } from '../../utils/async_storage';

const SequenceEditPage = ({ route, navigation }) => {
  const { sequenceId } = route.params;

  const [sequenceData, setSequenceData] = useState({
    id: 0,
    name: '',
    color: '',
    phases: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [updateFlag, setUpdateFlag] = useState(false);
  const triggerUpdate = () => setUpdateFlag(!updateFlag);

  const addPhase = (phase) =>
    setSequenceData({
      ...sequenceData,
      phases: [...sequenceData.phases, phase],
    });

  const removePhase = (phaseId) => {
    setSequenceData({
      ...sequenceData,
      phases: sequenceData.phases.filter((p) => p.id !== phaseId),
    });
  };

  const saveChanges = () => {
    setIsLoading(true);
    setError(false);
    storeSequence(
      sequenceId,
      sequenceData,
      () => triggerUpdate(),
      (e) => {
        setIsLoading(false);
        setError(true);
        console.warn('save exception', e);
      }
    );
  };

  useEffect(() => triggerUpdate(), []);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    getSequence(
      sequenceId,
      (data) => {
        console.log(data)
        setSequenceData(data);
        setIsLoading(false);
      },
      (e) => {
        setSequenceData({});
        setIsLoading(false);
        setError(true);
        console.warn('exception', e);
      }
    );
  }, [updateFlag]);

  const updatePhase = (newPhase) => {
    const modifiedPhases = sequenceData.phases;
    const phaseIndex = modifiedPhases.findIndex((p) => p.id === newPhase.id);
    modifiedPhases[phaseIndex] = newPhase;
    setSequenceData({ ...sequenceData, phases: modifiedPhases });
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
            <Text style={{ fontSize: 24 }}>{sequenceData.name}</Text>
          )
        }
        extraTitleComponent={
          isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={{ fontSize: 20 }}>
              {sequenceData.phases.length} phases
            </Text>
          )
        }
        rightComponent={
          <ButtonBadge
            badgeType="delete"
            handlePress={() => console.log(`remove`)}
            size={60}
          />
        }
      />

      <PageList>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          sequenceData.phases.map((phase) => (
            <View key={phase.id}>
              <PageListItem
                leftButton={{
                  handlePress: () => console.log(`badge clicked`),
                  badgeType: 'info',
                  size: 60,
                }}
                labelComponent={
                  <TextInput
                    keyboardType="default"
                    style={{ fontSize: 20 }}
                    onChangeText={(newName) =>
                      updatePhase({ ...phase, name: newName })
                    }
                  >
                    {phase.name}
                  </TextInput>
                }
                middleButton={{
                  handlePress: () => console.log('Color changed!'),
                  badgeType: 'red',
                  size: 40,
                }}
                rightButton={{
                  handlePress: () => removePhase(phase.id),
                  badgeType: 'cross',
                  size: 40,
                }}
              />
              <TimeEdit
                time={phase.time}
                handleUpdate={(newTime) =>
                  updatePhase({ ...phase, time: newTime })
                }
              />
            </View>
          ))
        )}

        <ButtonBadge
          badgeType="add"
          size={100}
          handlePress={() => {
            if (!isLoading && !error) {
              const id = parseInt(sequenceData.phases.slice(-1)[0].id, 10) + 1 || 1
              addPhase({
                id: id,
                name: `Phase ${id}`,
                badge: 'info',
                color: 'blue',
                time: '00:05',
              });
            }
          }}
        />
      </PageList>

      <View style={styles.buttonWrapper}>
        <ButtonBadge
          badgeType="reload"
          size={70}
          extraStyle={{ width: 70 }}
          handlePress={() => triggerUpdate()}
        />
        <ButtonBadge
          badgeType="save"
          size={70}
          extraStyle={{ width: 70 }}
          handlePress={() => saveChanges()}
        />
      </View>
    </View>
  );
};

export default SequenceEditPage;
