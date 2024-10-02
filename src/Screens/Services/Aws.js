/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../../component/Header';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Icon, {Icons} from '../../icons/icons';
import {BlurView} from '@react-native-community/blur';
import {ConfContext} from '../../Helper/ConfContext';
import {sendaws, sendData} from '../../Hook/SendDataBLE';
import {atob} from 'react-native-quick-base64';
import {BleManager} from 'react-native-ble-plx';
import FastImage from 'react-native-fast-image';

const Aws = ({route, navigation}) => {
  const {addBlur, setAddblur} = useContext(ConfContext);
  const [endPoint, setEndPoint] = useState(
    'aregbm28694ad-ats.iot.eu-north-1.amazonaws.com',
  );
  const [Topic, setTopic] = useState('esp32/testtopic');
  const [Port, setPort] = useState(8883);
  const [AmazonRootCA, setAmazonRootCA] = useState('');
  const [PrivateKey, setPrivateKey] = useState('');
  const [DeviceCrt, setDeviceCrt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const {ConnectedDevice, setConnectedDevice} = useContext(ConfContext);
  const {ReciveData, setReciveData} = useContext(ConfContext);

  useEffect(() => {
    console.log('************', Port);
    console.log('************', endPoint);
  }, [Port, endPoint]);

  const handleFilePick = async (endWith, setFileData, characteristic) => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      let fileUri = file.uri;

      if (file.name.endsWith(endWith)) {
        console.log('Selected file:', fileUri);

        if (Platform.OS === 'android' && fileUri.startsWith('content://')) {
          const destPath = `${RNFS.TemporaryDirectoryPath}/${file.name}`;
          await RNFS.copyFile(fileUri, destPath);
          fileUri = destPath;
        }

        const fileStat = await RNFS.stat(fileUri);
        const fileSize = fileStat.size;
        console.log('File size:', fileSize);

        const fileData = await RNFS.readFile(fileUri, 'utf8');

        setFileData(fileData);
        await sendaws(ConnectedDevice, characteristic, fileData, fileSize);
      } else {
        Alert.alert('Invalid File', `Please select a valid ${endWith} file.`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
      } else {
        console.error('File picker error:', err);
      }
    }
  };
  const [DONECA, setDONECA] = useState(false);
  const [DONEPK, setDONEPK] = useState(false);
  const [DONEDC, setDONEDC] = useState(false);

  useEffect(() => {
    console.log('ReciveDataReciveData', ReciveData);
    if (ReciveData == 'DONECA') {
      setDONECA(true);
    }
    if (ReciveData == 'DONEPK') {
      setDONEPK(true);
    }
    if (ReciveData == 'DONEDC') {
      setDONEDC(true);
    }
  }, [ReciveData]);

  return (
    <SafeAreaView style={{height: '100%'}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
        textStyle={{fontWeight: '100', fontSize: 20}}
      />
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 100,
          }}>
          <Text
            style={{
              color: '#393939',
              fontSize: 20,
              fontWeight: '500',
              marginBottom: 20,
            }}>
            Connect To AMAZON AWS
          </Text>
          <Text
            style={{
              color: '#393939',
              fontSize: 15,
              fontWeight: '300',
              textAlign: 'center',
            }}>
            Please Insert Your Correct AWS Information
          </Text>

          <View>
            {/* <Button
            title="Select AmazonRootCA1.pem File "
            onPress={handleFilePick}
          /> */}

            <View style={{marginTop: 20, flexDirection: 'row'}}>
              <View style={{marginRight: 40}}>
                <Text style={styles.label}>Your AWS EndPoint:</Text>
                <TextInput
                  style={[styles.textArea, {width: 150}]}
                  multiline={true}
                  numberOfLines={5}
                  value={endPoint}
                  onChangeText={setEndPoint}
                  placeholder="Type EndPoint here..."
                  placeholderTextColor="#c7c7c7"
                />
              </View>

              <View style={{width: 70}}>
                <Text style={[styles.label, {margin: 0}]}>PORT:</Text>
                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  defaultValue="8883"
                  value={Port}
                  onChangeText={setPort}
                  placeholder="PORT"
                  placeholderTextColor="#c7c7c7"
                />
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  height: 130,
                  borderRadius: 7,
                  width: 250,
                }}
                onPress={() => {
                  handleFilePick(
                    '.pem',
                    setAmazonRootCA,
                    'e0ddadc2-2375-4d77-ab2e-138d7b2e9d88',
                  );
                }}>
                <Text style={{color: 'black', marginBottom: 20}}>
                  AmazonRootCA1.pem
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      backgroundColor: '#ebebeb',
                      height: 40,
                      padding: 9,
                      borderRadius: 10,
                      marginLeft: AmazonRootCA ? 20 : 0,
                    }}>
                    <Text style={{color: 'black'}}>Upload File</Text>
                  </View>
                  {AmazonRootCA && (
                    <View
                      style={{
                        //marginLeft:20,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {!DONECA ? (
                        <FastImage
                          style={{height: 20, width: 20}}
                          source={require('../../media/loader.gif')}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <Icon
                          name="file-download-done"
                          type={Icons.MaterialIcons}
                          color="green"
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {/* **************************** */}
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  height: 130,
                  borderRadius: 7,
                  width: 250,
                }}
                onPress={() => {
                  handleFilePick(
                    '.key',
                    setPrivateKey,
                    'b339a10a-241b-441c-917a-6a67fd0439fa',
                  );
                }}>
                <Text style={{color: 'black', marginBottom: 20}}>
                  Private_key.key
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      backgroundColor: '#ebebeb',
                      height: 40,
                      padding: 9,
                      borderRadius: 10,
                      marginLeft: PrivateKey ? 20 : 0,
                    }}>
                    <Text style={{color: 'black'}}>Upload File</Text>
                  </View>
                  {PrivateKey && (
                    <View
                      style={{
                        //marginLeft:20,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {!DONEPK ? (
                        <FastImage
                          style={{height: 20, width: 20}}
                          source={require('../../media/loader.gif')}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <Icon
                          name="file-download-done"
                          type={Icons.MaterialIcons}
                          color="green"
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {/* ******************************* */}
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  height: 130,
                  borderRadius: 7,
                  width: 250,
                }}
                onPress={() => {
                  handleFilePick(
                    '.crt',
                    setDeviceCrt,
                    '0f9828d1-5883-4830-944d-3be736f3bbe7',
                  );
                }}>
                <Text style={{color: 'black', marginBottom: 20}}>
                  Device_certificate.crt
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      backgroundColor: '#ebebeb',
                      height: 40,
                      padding: 9,
                      borderRadius: 10,
                      marginLeft: DeviceCrt ? 20 : 0,
                    }}>
                    <Text style={{color: 'black'}}>Upload File</Text>
                  </View>
                  {DeviceCrt && (
                    <View
                      style={{
                        //marginLeft:20,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {!DONEDC ? (
                        <FastImage
                          style={{height: 20, width: 20}}
                          source={require('../../media/loader.gif')}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <Icon
                          name="file-download-done"
                          type={Icons.MaterialIcons}
                          color="green"
                        />
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <View style={{marginTop: 20}}>
                <Text style={[styles.label, {margin: 0}]}>TOPIC:</Text>
                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  //numberOfLines={4}
                  defaultValue="esp32/testtopic"
                  value={Topic}
                  onChangeText={setTopic}
                  placeholder="TOPIC"
                  placeholderTextColor="#c7c7c7"
                />
              </View>

              <View style={{alignItems: 'center', marginTop: 10}}>
                <TouchableOpacity
                  style={{
                    borderRadius: 7,
                    width: 110,
                    height: 40,
                    backgroundColor: '#66c700',
                    alignItems: 'center',
                  }}
                  onPress={async () => {
                    setModalVisible(true);
                    setAddblur(true);
                    //handleSendData();
                    await sendaws(
                      ConnectedDevice,
                      '8092f44e-bd8c-469c-9b1d-da63f1f500c1',
                      endPoint,
                      0,
                    );
                    await sendaws(
                      ConnectedDevice,
                      'a26b1da4-4eda-4e71-b28d-afb4c132dca5',
                      Port,
                      0,
                    );
                    sendaws(
                      ConnectedDevice,
                      '5943350c-8161-4536-b661-3dba6b5d2fa8',
                      Topic,
                      0,
                    );
                  }}>
                  <Text style={{color: 'white', position: 'relative', top: 10}}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
              width: 300,
              height: 250,
              borderRadius: 20,
              position: 'relative',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1,
              }}
              onPress={() => {
                setModalVisible(false);
                setAddblur(false);
              }}>
              <Icon name="closecircle" type={Icons.AntDesign} color="red" />
            </TouchableOpacity>

            {/* Modal Content */}
            <View
              style={{
                alignItems: 'center',
                padding: 10,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: '#393939',
                  fontSize: 15,
                  fontWeight: '300',
                  textAlign: 'center',
                }}>
                Please Can You Check Your MQTT test client And Confirm !
              </Text>
              <TouchableOpacity
                style={[styles.confirmbtn, {backgroundColor: '#66c700'}]}
                onPress={async () => {
                  // setModalVisible(true);
                  // setAddblur(true);
                }}>
                <Text
                  style={{
                    color: 'white',
                    position: 'relative',
                    top: 5,
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Done
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmbtn,
                  {backgroundColor: 'red', marginTop: 5},
                ]}
                onPress={async () => {
                  // setModalVisible(true);
                  // setAddblur(true);
                }}>
                <Text
                  style={{
                    color: 'white',
                    position: 'relative',
                    top: 5,
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // absolute: {
  //   zIndex: 99999999999,
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  // },
  confirmbtn: {
    borderRadius: 7,
    width: 110,
    height: 40,

    alignItems: 'center',
    marginTop: 20,
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

  textArea: {
    borderColor: '#cdcdcd',
    borderWidth: 2,
    borderRadius: 5,
    height: 50,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#636363',
  },
});

export default Aws;
