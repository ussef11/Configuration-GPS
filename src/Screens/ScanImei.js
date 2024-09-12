/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Image, View} from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../component/Header';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import Icon, {Icons} from '../icons/icons';
import FastImage from 'react-native-fast-image';
import {ConfContext} from '../Helper/ConfContext';

const ScanImei = ({route, navigation}) => {
  const {QrcodeData, setQrcodeData} = useContext(ConfContext);

  const [Qrscanner, setQrscanner] = useState(false);
  const [ButtonScan, setButtonScan] = useState(true);
  const [Done, setDone] = useState(false);

  useEffect(() => {
    if (QrcodeData) {
      setQrscanner(false);
      //setDone(true);
      console.log(QrcodeData);
      navigation.navigate('Bluetooth');
      // setTimeout(() => {

      // }, 2000);
    }
  }, [QrcodeData]);
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
            IMEI : {QrcodeData}
          </Text>
        </View>
      )}
      {ButtonScan && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {QrcodeData && <Text style={{color: 'green'}}>{QrcodeData}</Text>}
          <TouchableOpacity
            onPress={() => {
              setQrscanner(true);
              setButtonScan(false);
            }}
            style={styles.buttonTouchable}>
            <Icon name="camera" type={Icons.Entypo} color="green" />

            <Text style={styles.textscan}>Start Scan</Text>
          </TouchableOpacity>
        </View>
      )}
      {Qrscanner && (
        <QRCodeScanner
          onRead={e => {
            const qrData = e.data;
            const imeiMatch = qrData.match(/IMEI:(\d+)/);

            if (imeiMatch && imeiMatch[1]) {
              const imei = imeiMatch[1];
              setQrcodeData(imei);
            } else {
              console.error('IMEI not found in QR code data');
            }
          }}

          //flashMode={RNCamera.Constants.FlashMode.torch}
          // topContent={
          //   <Text style={styles.centerText}>
          //     Go to{' '}
          //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
          //     your computer and scan the QR code.
          //   </Text>
          // }
          // bottomContent={
          //   <TouchableOpacity style={styles.buttonTouchable}>
          //     <Text style={styles.buttonText}>OK. Got it!</Text>
          //   </TouchableOpacity>
          // }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    backgroundColor: '#272727',
    height: 70,
    width: 200,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textscan: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'sans-serif',
  },
});

export default ScanImei;
