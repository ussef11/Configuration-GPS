/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useContext, useEffect, useState} from 'react';
import {BleManager} from 'react-native-ble-plx';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {encode} from 'base-64';
import {ConfContext} from '../Helper/ConfContext';
import {atob} from 'react-native-quick-base64';
import MyHeader from '../component/Header';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';

const BleScreen = ({route, navigation}) => {
  const [data, setData] = useState(null);
  const [Done, setDone] = useState(false);

  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const {QrcodeData, setQrcodeData} = useContext(ConfContext);
  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);

  useEffect(() => {
    console.log(' QrcodeDataQrcodeData', QrcodeData);
  }, [QrcodeData]);

  useFocusEffect(
    React.useCallback(() => {
      const intervalId = setInterval(() => {
        console.log('change***');
        setShowLoader(prevShowLoader => !prevShowLoader);
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }, []),
  );

  const [bleManager] = useState(new BleManager());
  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, [bleManager]);

  useEffect(() => {
    const checkBluetoothState = async () => {
      try {
        await requestBluetoothPermission();
        const bluetoothState = await BluetoothStateManager.getState();

        switch (bluetoothState) {
          case 'PoweredOff':
            navigation.reset({
              index: 0,
              routes: [{name: 'Scan Imei'}],
            });

            console.log('Bluetooth is off');
            Alert.alert(
              'App would like to use Bluetooth.',
              'This app uses Bluetooth to connect to and share information with your GPS',
              [
                {
                  text: "Don't allow",
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Turn ON',
                  onPress: async () => {
                    await BluetoothStateManager.openSettings();
                  },
                },
              ],
            );

            break;
          case 'PoweredOn':
            console.log('Bluetooth is on');
            scanAndConnect();
            break;
          default:
            console.log('Bluetooth state:', bluetoothState);
        }
      } catch (error) {
        console.error('Error checking Bluetooth state:', error);
      }

      BluetoothStateManager.addEventListener(
        BluetoothStateManager.EVENT_BLUETOOTH_STATE_CHANGE,
        async bluetoothState => {
          if (bluetoothState === 'PoweredOff') {
            await BluetoothStateManager.enable();
            console.log('Bluetooth enabled');

            scanAndConnect();
          }
        },
      );
    };

    checkBluetoothState();
  }, []);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version, 10);

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result['android.permission.BLUETOOTH_CONNECT'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return false;
  };

  const scanAndConnect = async () => {
    try {
      const permissionGranted = await requestBluetoothPermission();
      if (!permissionGranted) {
        console.error('Bluetooth permissions not granted');
        return;
      }

      console.log('Scanning for BLE devices...');
      bleManager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          setTimeout(() => {
            console.log('Restarting scan...');
          }, 9000);
          return;
        }

        if (device.name != null) {
          console.log('Found BLE device:', device.name, device.id);
        }
        if (device.name === QrcodeData) {
          console.log('Connecting to device...');
          bleManager.stopDeviceScan();
          await connectToDevice(device);
        } else {
          setDevices(prevDevices => {
            if (!prevDevices.some(d => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });
    } catch (error) {
      console.error('******************Error scanning for BLE devices:', error);
    }
  };

  // useEffect(() => {
  //   console.log(devices);
  // }, [devices]);

  const connectToDevice = async device => {
    try {
      await bleManager.stopDeviceScan();
      await disconnectFromAllDevices();
      const connectedDevice = await device.connect();
      console.log('Connected to device:', connectedDevice.name);
      setConnectedDevice(device);

      setIsConnected(true);
      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      for (const service of services) {
        //console.log('Service found:', service.uuid);

        const characteristics = await connectedDevice.characteristicsForService(
          service.uuid,
        );

        //RecieveData();

        for (const characteristic of characteristics) {
          let charuuid = characteristic.uuid;

          if (charuuid === '7ce9fd0d-cf46-4838-b39c-9447f6f80256') {
            let message = encode('Connected to characteristic');

            characteristic.writeWithResponse(message);
            setDone(true);

            setTimeout(() => {
              navigation.navigate('Network');
            }, 2000);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      connectToDevice(device);
      bleManager.stopDeviceScan();
    }
  };

  const disconnectFromDevice = async deviceId => {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
      console.log('Disconnected from device:', deviceId);
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }
  };

  const disconnectFromAllDevices = async () => {
    try {
      const connectedDevices = await bleManager.connectedDevices([]);
      if (connectedDevices.length > 0) {
        console.log('Disconnecting from all devices...');
        await Promise.all(
          connectedDevices.map(device => disconnectFromDevice(device.id)),
        );
        console.log('Disconnected from all devices');
      } else {
        console.log('No devices are currently connected');
      }
    } catch (error) {
      console.log('Error disconnecting from devices:', error);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />
      {Done && (
        <View
          style={{
            marginTop: 70,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FastImage
            style={{height: 350, width: 350}}
            source={require('../media/done.gif')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={{color: 'black', position: 'relative', bottom: 100}}>
            IMEI : {QrcodeData}{' '}
            <Text style={{color: 'green', fontWeight: '800'}}>CONNECTED</Text>
          </Text>
        </View>
      )}
      {!Done && (
        <ScrollView>
          <View
            style={{flex: 1, alignItems: 'center', marginTop: 50, padding: 10}}>
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
            <View
              style={{
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <FastImage
                style={{height: 50, width: 50}}
                source={{uri: 'https://ezgif.com/images/loadcat.gif'}}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View style={{borderWidth: 0.4, marginTop: 30, width: '90%'}} />
            </View>
            {devices && (
              <View style={{marginTop: 5, marginBottom: 100}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#393939',
                      fontSize: 15,
                      fontWeight: '300',
                      textAlign: 'center',
                    }}>
                    Available Device
                  </Text>
                  {showLoader && (
                    <FastImage
                      style={{height: 20, width: 20}}
                      source={require('../media/loader.gif')}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  )}
                </View>

                {devices.map(device => (
                  <View>
                    {device.name && (
                      <TouchableOpacity
                        onPress={() => {
                          connectToDevice(device);
                        }}
                        key={device.id}
                        style={{
                          backgroundColor: '#fff',
                          paddingLeft: 5,
                          paddingRight: 5,
                          borderRadius: 10,
                          marginTop: 10,

                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            height: 30,
                            marginBottom: 10,
                            color: 'black',
                            textAlignVertical: 'center',
                          }}>
                          {device.name || 'Unnamed Device'}: {device.id}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mytext: {
    color: '#393939',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
});
export default BleScreen;
