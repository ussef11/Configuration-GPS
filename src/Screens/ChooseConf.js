/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon, {Icons} from '../icons/icons';

const ChooseConf = ({route, navigation}) => {
  const [buttonText, setButtonText] = useState('Click Me!');

  const handlePressWifi = () => {
    navigation.navigate('Wifi configuration');
    // setButtonText('Hello, World!');
    // setTimeout(() => setButtonText('Click Me!'), 1400);
  };
  const handlePressSim = () => {
    navigation.navigate('Sim configuration');
    // setButtonText('Hello, World!');
    // setTimeout(() => setButtonText('Click Me!'), 1400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {marginBottom: 20}]}
        activeOpacity={0.7}
        onPress={handlePressWifi}>
        <Text style={styles.text}>
          WIFI <Icon name="wifi" type={Icons.AntDesign} color="white" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={handlePressSim}>
        <Text style={styles.text}>
          SIM <Icon name="sim-card" type={Icons.FontAwesome5} color="white" />
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#272727',
    borderColor: 'rgba(116, 238, 21, 0.76)',
    borderWidth: 2,
    shadowColor: 'rgba(116, 238, 21, 0.75)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 10,
    transitionDuration: '0.5s',
  },
  text: {
    color: 'white',
    fontSize: 23,
    textShadowColor: 'black',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
});

export default ChooseConf;
