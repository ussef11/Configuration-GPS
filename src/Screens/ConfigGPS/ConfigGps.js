/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import MyHeader from '../../component/Header';
import {TextInput} from 'react-native-gesture-handler';

const ConfigGps = ({route, navigation}) => {
  const [Delay, setDelay] = useState();
  const [frequence, setFrequence] = useState();
  return (
    <SafeAreaView style={{height: '100%'}}>
      <MyHeader
        title={route.name}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
        textStyle={{fontWeight: '100', fontSize: 20}}
      />
      <ScrollView>
        <View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 100,
              alignContent: 'center',
            }}>
            <Text
              style={{
                color: '#393939',
                fontSize: 20,
                fontWeight: '500',
                marginBottom: 20,
              }}>
              Configuration GPS
            </Text>
            <Text
              style={{
                color: '#393939',
                fontSize: 15,
                fontWeight: '300',
                textAlign: 'center',
              }}>
              Please Insert Your Configuration For Your GPS
            </Text>
          </View>
          <View>
            <View style={{marginTop: 20, flexDirection: 'column'}}>
              <View style={{marginRight: 40}}>
                <Text style={styles.label}>Your AWS EndPoint:</Text>
                <TextInput
                  style={[styles.textArea, {width: 150}]}
                  multiline={true}
                  numberOfLines={5}
                  value={Delay}
                  onChangeText={setDelay}
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
                  value={frequence}
                  onChangeText={setFrequence}
                  placeholder="PORT"
                  placeholderTextColor="#c7c7c7"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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

export default ConfigGps;
