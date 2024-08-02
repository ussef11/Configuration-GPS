/* eslint-disable react/self-closing-comp */
import React, {useContext, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MyHeader from '../component/Header';

import {Button} from 'react-native-paper';
import {ConfContext} from '../Helper/ConfContext';
import {ReceiveData, stopMonitoring} from '../Hook/ReveiveData';

const TestTrams = ({route, navigation}) => {
  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const {Tram, setTram} = useContext(ConfContext);

  const testReceive = async () => {
    console.log('ReceiveData');
    try {
      await ReceiveData(ConnectedDevice, setTram);
    } catch (error) {
      console.error('Error in testReceive:', error);
    }
  };
  const Stop = async () => {
    console.log('ReceiveData');
    try {
      stopMonitoring();
    } catch (error) {
      console.error('Error in testReceive:', error);
    }
  };

  useEffect(() => {
    console.log('Tram', Tram);
  }, [Tram]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />
      <View>
        <Text>TestTrams </Text>
        <TouchableOpacity onPress={testReceive}>
          <Text style={{color: 'black'}}>Receive Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Stop}>
          <Text style={{color: 'black'}}>Stop RecieveData</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TestTrams;
