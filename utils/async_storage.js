import AsyncStorage from '@react-native-async-storage/async-storage';
import constant from 'lodash/constant';
import { MOCK_SEQUENCE_DATA } from './mock_data';

const storeData = async (storageKey, value, onSuccess, onError) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`@${storageKey}`, jsonValue);

    onSuccess();
  } catch (e) {
    onError(e);
  }
};

const getData = async (storageKey, onSuccess, onError) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@${storageKey}`);

    onSuccess(jsonValue != null ? JSON.parse(jsonValue) : null);
  } catch (e) {
    onError(e);
  }
};

const getAllSpecificData = async (type, onSuccess, onError) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const typeRegex = new RegExp(`@${type}_\\S+`, 'g')
    const jsonValues = await AsyncStorage.multiGet(
      keys.filter((key) => key.match(typeRegex))
    );

    const parsedValues = jsonValues.map((pair) => (pair[1] != null ? JSON.parse(pair[1]) : null))
    onSuccess(parsedValues);
  } catch (e) {
    onError(e);
  }
};

const resetProvidedData = async (
  type,
  data,
  onSuccess = () => console.log('Seeds applied successfully'),
  onError = (e) => console.warn('Seeds failed with exception:', e)
) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const typeRegex = new RegExp(`@${type}_\\S+`, 'g')

    AsyncStorage.multiRemove(keys.filter((key) => key.match(typeRegex)));
    
    for (let i = 0; i < data.length; i += 1)
      storeSequence(i + 1, data[i], constant(null), constant(null));

    onSuccess();
  } catch (e) {
    onError(e);
  }
};

export const resetSequences = async (onSuccess, onError) =>
  resetProvidedData('sequence', MOCK_SEQUENCE_DATA, onSuccess, onError);

export const getAllSequences = async (onSuccess, onError) =>
  getAllSpecificData('sequence', onSuccess, onError);

export const getSequence = async (id, onSuccess, onError) =>
  getData(`sequence_${id}`, onSuccess, onError);

export const storeSequence = async (id, value, onSuccess, onError) =>
  storeData(`sequence_${id}`, value, onSuccess, onError);
