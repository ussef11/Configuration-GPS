// bluetoothUtils.js
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {atob} from 'react-native-quick-base64';
import {useContext, useEffect, useState} from 'react';
import {ConfContext} from '../Helper/ConfContext';

const bleManager = new BleManager();

let monitor;

export const ReceiveData = async (ConnectedDevice, setTram) => {
  const [data, setData] = useState(null);

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
            if (decodedData != 'Connected' || decodedData != 'Failed') {
              const newData = JSON.parse(decodedData);

              setData(prevData => ({
                ...prevData,
                ...newData,
              }));
              // setTram(decodedData);
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

export const stopMonitoring = () => {
  if (monitor) {
    monitor.remove();
    monitor = null;
    console.log('Stopped monitoring characteristic');
  } else {
    console.log('No active monitor to stop');
  }
};
