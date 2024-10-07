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
import {sendDataSim} from '../Hook/SendDataBLE';
import {Modal, TextInput} from 'react-native-paper';
import MyHeader from '../component/Header';
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {atob} from 'react-native-quick-base64';
import FastImage from 'react-native-fast-image';

const SimConf = ({route, navigation}) => {
  const bleManager = new BleManager();

  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const {addBlur, setAddblur} = useContext(ConfContext);

  const [Pin, setPin] = useState('5983');
  const [Apn, setApn] = useState('iam');
  const [Username, setUsername] = useState('Youssef');
  const [password, setPassword] = useState('0000');
  const [statusSIM, setStatusSim] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSendData = async () => {
    //setAddblur(true);
    setModalVisible(true);
    if (Pin && Apn && ConnectedDevice) {
      await sendDataSim(Pin, Apn, Username, password, ConnectedDevice);
    } else {
      Alert.alert(
        'Please enter  All information Required, and ensure a device is connected.',
      );
    }

    RecieveData();
  };

  let monitorSubscription;

  const [connectionStatus, setConnectionStatus] = useState('');

  const RecieveData = async () => {
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
          if (characteristic.uuid === 'eb3fb5c6-1c22-4a01-811e-96bcdb282a07') {
            monitorSubscription = characteristic.monitor((error, update) => {
              if (error) {
                console.error(`Characteristic monitor error: ${error}`);
                return;
              }
              //console.log('Received update:', update);
              try {
                if (update && update.value) {
                  const decodedData = atob(update.value);
                  console.log('Decoded Data:', decodedData);
                  stopMonitoring();

                  setStatusSim(decodedData);

                  //setModalVisible(false);
                  //setAddblur(false);
                } else {
                  console.log('No value in update.');
                }
              } catch (parseError) {
                console.error('Error parsing received data:', parseError);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error receiving data:', error);
    }
  };

  const stopMonitoring = () => {
    if (monitorSubscription) {
      monitorSubscription.remove();
      console.log('Monitoring stopped.');
    } else {
      console.log('No active monitor subscription to stop.');
    }
  };

  useEffect(() => {
    if (statusSIM == 1) {
      setTimeout(() => {
        navigation.navigate('Verify Comming Data');
      }, 2000);
    }
  }, [statusSIM]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />

      <View style={{alignItems: 'center', marginTop: 0, padding: 10}}>
        <Text style={styles.mytext}>
          oops, Your Bluetooth Device Not Found !
        </Text>
        <Text
          style={{
            color: '#393939',
            fontSize: 15,
            fontWeight: '300',
            textAlign: 'center',
          }}>
          Please make sure your Bluetooth device is Not available
        </Text>
      </View>
      <View style={styles.container}>
        {/* <View style={{alignItems: 'center', marginBottom: 10}}>
          <Text style={{color: 'black', fontSize: 20}}>
            SIM Card Information
          </Text>
        </View> */}
        <Text style={{color: 'black', width: '80%'}}>PIN Number :</Text>
        <TextInput
          placeholder="PIN Number"
          value={Pin}
          onChangeText={text => setPin(text)}
          style={styles.textinput}
        />
        <Text style={{color: 'black', width: '80%'}}>APN :</Text>
        <TextInput
          placeholder="APN"
          value={Apn}
          onChangeText={text => setApn(text)}
          style={styles.textinput}
        />
        <Text style={{color: 'black', width: '80%'}}>UserName (optimal):</Text>

        <TextInput
          placeholder="UserName"
          value={Username}
          onChangeText={text => setUsername(text)}
          style={styles.textinput}
        />
        <Text style={{color: 'black', width: '80%'}}>Password (optimal):</Text>

        <TextInput
          placeholder="Password"
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
          {statusSIM ? (
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
                  statusSIM == 1
                    ? {height: 350, width: 350}
                    : {height: 100, width: 100}
                }
                source={
                  statusSIM == 1
                    ? require('../media/done.gif')
                    : require('../media/notConnected.png')
                }
                resizeMode={FastImage.resizeMode.contain}
              />
              <Text
                style={
                  statusSIM == 1
                    ? {color: 'black', position: 'relative', bottom: 100}
                    : {color: 'black', position: 'relative', bottom: 0}
                }>
                <Text
                  style={{
                    color: statusSIM === 1 ? 'green' : 'red',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}>
                  {statusSIM == 1 ? 'Connected' : 'Error'}
                </Text>
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.centeredView,
                {
                  backgroundColor: '#fff',
                  width: 250,
                  height: 250,
                  borderRadius: 20,
                },
              ]}>
              <Text
                style={{
                  color: 'black',
                  marginBottom: 20,
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Please Wait SIM Configuration...
              </Text>
              <FastImage
                style={{height: 80, width: 80}}
                source={{uri: 'https://ezgif.com/images/loadcat.gif'}}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          )}
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
    marginTop: -150,
    alignContent: 'center',
  },
  textinput: {
    height: 40,

    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
  },
  centeredView: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
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
    zIndex: 5,
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
export default SimConf;
