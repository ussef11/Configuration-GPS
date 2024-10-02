/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
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
import {sendData, sendStopMonitoring} from '../Hook/SendDataBLE';

const TestTrams = ({route, navigation}) => {
  const bleManager = new BleManager();

  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const {ReciveData, setReciveData} = useContext(ConfContext);
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
                console.log('-----', decodedData);
                setReciveData(decodedData);
                console.log('-----');
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
      //await stopMonitoring();
    } catch (error) {
      console.error('Error in testReceive:', error);
    }
    navigation.navigate('Choose Servies');
  };

  useEffect(() => {
    ReceiveData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />
      <View>
        {/* <View
          style={{
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={ReceiveData}
            style={{
              borderRadius: 7,
              width: 90,
              height: 30,
              backgroundColor: '#83ff00',

              alignItems: 'center',
            }}>
            <Text style={{color: 'black'}}>Receive Data</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      {data ? (
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            marginBottom: 9,
            marginTop: 9,
            alignItems: 'center',
          }}>
          {Object.keys(data).map(key => (
            <Text key={key} style={{color: 'black'}}>
              {`${key}: ${data[key]}`}
            </Text>
          ))}
        </View>
      ) : (
        <View>
          <Text style={{color: 'black'}}>No Data There is A probleme</Text>
        </View>
      )}
      {data && (
        <View
          style={{
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              borderRadius: 7,
              width: 110,
              height: 30,
              backgroundColor: '#83ff00',
              alignItems: 'center',
            }}
            onPress={async () => {
              await sendStopMonitoring(false, ConnectedDevice);
              navigation.navigate('Choose Services');
            }}>
            <Text style={{color: 'white', position: 'relative', top: 5}}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TestTrams;
