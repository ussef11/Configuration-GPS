// bluetoothUtils.js
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';

const bleManager = new BleManager();

const disconnectFromDevice = async deviceId => {
  try {
    await bleManager.cancelDeviceConnection(deviceId);
    console.log('Disconnected from device:', deviceId);
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

export const sendData = async (ssid, password, _ConnectedDevice) => {
  try {
    const message = JSON.stringify({ssid, password});

    await bleManager.stopDeviceScan();
    await disconnectFromAllDevices();
    const connectedDevice = await _ConnectedDevice.connect();
    console.log('Connected to device:', connectedDevice.name);
    await connectedDevice.discoverAllServicesAndCharacteristics();
    const services = await connectedDevice.services();
    for (const service of services) {
      const characteristics = await connectedDevice.characteristicsForService(
        service.uuid,
      );
      for (const characteristic of characteristics) {
        let charuuid = characteristic.uuid;
        if (charuuid === '7ce9fd0d-cf46-4838-b39c-9447f6f80256') {
          // let message = encode(_message);
          await characteristic.writeWithResponse(encode(message));
          return;
        }
      }
    }
  } catch (error) {
    console.error('Error in sendData:', error);
  }
};

export const sendStopMonitoring = async (value, _ConnectedDevice) => {
  try {
    const message = JSON.stringify({value});

    await bleManager.stopDeviceScan();
    await disconnectFromAllDevices();
    const connectedDevice = await _ConnectedDevice.connect();
    console.log('Connected to device:', connectedDevice.name);
    await connectedDevice.discoverAllServicesAndCharacteristics();
    const services = await connectedDevice.services();
    for (const service of services) {
      const characteristics = await connectedDevice.characteristicsForService(
        service.uuid,
      );
      for (const characteristic of characteristics) {
        let charuuid = characteristic.uuid;
        if (charuuid === '7219a2ff-db61-4cb6-8ef8-0d6110c86f1b') {
          // let message = encode(_message);
          await characteristic.writeWithResponse(encode(message));
          return;
        }
      }
    }
  } catch (error) {
    console.error('Error in sendData:', error);
  }
};
