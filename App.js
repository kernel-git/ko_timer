import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SequenceEditPage from './pages/SequenceEdit';
import SequenceListPage from './pages/SequenceList';
import SequencePlayPage from './pages/SequencePlay';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SequenceList"
      >
        <Stack.Screen name="SequenceList" component={SequenceListPage} />
        <Stack.Screen name="SequenceEdit" component={SequenceEditPage} />
        <Stack.Screen name="SequencePlay" component={SequencePlayPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
