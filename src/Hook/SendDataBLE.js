// bluetoothUtils.js
import {BleManager} from 'react-native-ble-plx';
import {encode} from 'base-64';
import {Buffer} from 'buffer'; // Import Buffer from the buffer package

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

export const sendaws = async (
  _ConnectedDevice,
  _characteristic,
  data,
  size,
) => {
  try {
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

        if (charuuid === _characteristic) {
          if (size !== 0) {
            const mtuSize = 50;

            console.log('Sending file size:', size);
            const sizeBuffer = Buffer.from(size.toString(), 'utf-8').toString(
              'base64',
            );
            await characteristic.writeWithResponse(sizeBuffer);

            const chunks = splitIntoChunks(data, mtuSize);
            for (const chunk of chunks) {
              console.log('Sending chunk: ', chunk);
              const chunkBuffer = Buffer.from(chunk, 'utf-8').toString(
                'base64',
              );
              await characteristic.writeWithResponse(chunkBuffer);
            }

            return;
          } else {
            await characteristic.writeWithResponse(encode(data));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in sendaws:', error);
  }
};

const splitIntoChunks = (data, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
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

export const sendDataSim = async (
  pin,
  apn,
  username,
  password,
  _ConnectedDevice,
) => {
  try {
    const message = JSON.stringify({pin, apn, username, password});

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
        if (charuuid === 'eb3fb5c6-1c22-4a01-811e-96bcdb282a07') {
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

// export const sendportaws = async (ssid, password, _ConnectedDevice) => {
//   try {
//     const message = JSON.stringify({ssid, password});

//     await bleManager.stopDeviceScan();
//     await disconnectFromAllDevices();
//     const connectedDevice = await _ConnectedDevice.connect();
//     console.log('Connected to device:', connectedDevice.name);
//     await connectedDevice.discoverAllServicesAndCharacteristics();
//     const services = await connectedDevice.services();
//     for (const service of services) {
//       const characteristics = await connectedDevice.characteristicsForService(
//         service.uuid,
//       );
//       for (const characteristic of characteristics) {
//         let charuuid = characteristic.uuid;
//         if (charuuid === '7ce9fd0d-cf46-4838-b39c-9447f6f80256') {
//           // let message = encode(_message);
//           await characteristic.writeWithResponse(encode(message));
//           return;
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error in sendData:', error);
//   }
// };
