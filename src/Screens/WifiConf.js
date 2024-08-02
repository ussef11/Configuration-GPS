/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ConfContext} from '../Helper/ConfContext';
import {sendData} from '../Hook/SendDataBLE';
import {Modal, TextInput} from 'react-native-paper';
import MyHeader from '../component/Header';
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {atob} from 'react-native-quick-base64';
import FastImage from 'react-native-fast-image';

const WifiConf = ({route, navigation}) => {
  const bleManager = new BleManager();

  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const [ssid, setSsid] = useState('TP-Link_4270');
  const [password, setPassword] = useState('ifran123');
  const [statusWIFI, setStatusWIFI] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendData = async () => {
    if (ssid && password && ConnectedDevice) {
      await sendData(ssid, password, ConnectedDevice);
    } else {
      Alert.alert(
        'Please enter both SSID and password, and ensure a device is connected.',
      );
    }

    setTimeout(() => {
      RecieveData();
    }, 1000);
  };
  let monitor = null;

  const [connectionStatus, setConnectionStatus] = useState('');
  const RecieveData = async () => {
    console.log('RecieveDataRecieveDataRecieveDataRecieveData');
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
        if (characteristic.uuid === '7ce9fd0d-cf46-4838-b39c-9447f6f80256') {
          monitor = characteristic.monitor((error, update) => {
            if (error) {
              console.error(`Characteristic monitor error Receive: ${error}`);
              return;
            }
            //console.log('Found characteristic:', characteristic.uuid);
            const decodedData = atob(update.value);
            if (decodedData == 'Connected' || decodedData == 'Failed') {
              setStatusWIFI(decodedData);
              setModalVisible(true);

              // setStatusWIFI(decodedData);
              // setModalVisible(true);
              // const newData = JSON.parse(decodedData);
              //console.log(decodedData);
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    if (statusWIFI == 'Connected') {
      setTimeout(() => {
        navigation.navigate('Verify Comming Data');
      }, 2000);
    }
  }, [statusWIFI]);
  const disconnectFromDevice = async deviceId => {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
      console.log('Disconnected from device:', deviceId);
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />

      <View style={styles.container}>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text style={{color: 'black', fontSize: 20}}>WIFI Information</Text>
        </View>

        <TextInput
          placeholder="SSID"
          value={ssid}
          onChangeText={text => setSsid(text)}
          style={styles.textinput}
        />
        <TextInput
          placeholder="PASSWORD"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.textinput}
        />
        <Button title="Connect" onPress={handleSendData} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View
            style={{
              marginTop: -50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              width: 200,
              height: 200,
              borderRadius: 20,
            }}>
            <FastImage
              style={
                statusWIFI == 'Connected'
                  ? {height: 350, width: 350}
                  : {height: 100, width: 100}
              }
              source={
                statusWIFI == 'Connected'
                  ? require('../media/done.gif')
                  : require('../media/notConnected.png')
              }
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text
              style={
                statusWIFI == 'Connected'
                  ? {color: 'black', position: 'relative', bottom: 100}
                  : {color: 'black', position: 'relative', bottom: 0}
              }>
              <Text
                style={{
                  color: statusWIFI === 'Connected' ? 'green' : 'red',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                }}>
                {statusWIFI}
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  textinput: {
    height: 40,

    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: 180,
    width: 250,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default WifiConf;
