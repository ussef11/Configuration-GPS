/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import React, {useContext, useEffect, useState} from 'react';
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
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {atob} from 'react-native-quick-base64';
const TestTrams = ({route, navigation}) => {
  const bleManager = new BleManager();

  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const {Tram, setTram} = useContext(ConfContext);
  const [data, setData] = useState(null);
  let monitor;
  const ReceiveData = async () => {
    // const {Tram, setTram} = useContext(ConfContext);

    try {
      console.log('Starting data reception...');
      await bleManager.stopDeviceScan();

      const connectedDevice = await ConnectedDevice.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      console.log(
        'Discovered services:',
        services.map(service => service.uuid),
      );

      for (const service of services) {
        const characteristics = await connectedDevice.characteristicsForService(
          service.uuid,
        );

        for (const characteristic of characteristics) {
          monitor = characteristic.monitor((error, update) => {
            if (error) {
              console.error(`Characteristic monitor error: ${error}`);
              return;
            }

            try {
              const decodedData = atob(update.value);
              if (decodedData != 'Connected' && decodedData != 'Failed') {
                console.log(decodedData);
                const newData = JSON.parse(decodedData);

                setData(prevData => ({
                  ...prevData,
                  ...newData,
                }));
              }
            } catch (parseError) {
              console.error('Error parsing received data:', parseError);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error receiving data:', error);
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
        <TouchableOpacity onPress={ReceiveData}>
          <Text style={{color: 'black'}}>Receive Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Stop}>
          <Text style={{color: 'black'}}>Stop RecieveData</Text>
        </TouchableOpacity>
      </View>
      {data && (
        <View style={{backgroundColor: 'white', padding: 10}}>
          {Object.keys(data).map(key => (
            <Text key={key} style={{color: 'black'}}>
              {`${key}: ${data[key]}`}
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default TestTrams;
