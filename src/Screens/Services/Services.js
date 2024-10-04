/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon, {Icons} from '../../icons/icons';

const Services = ({route, navigation}) => {
  const [buttonText, setButtonText] = useState('Click Me!');

  const handleNavigate = (navigate, params) => {
    navigation.navigate(navigate);
    // setButtonText('Hello, World!');
    // setTimeout(() => setButtonText('Click Me!'), 1400);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {alignItems: 'flex-start', paddingLeft: 15, marginBottom: 20},
        ]}
        activeOpacity={0.7}
        onPress={() => {
          handleNavigate('AWS IOT');
          //handleNavigate('Configuration GPS', {path: 'AWS IOT'});
        }}>
        <View
          style={{
            marginBottom: 15,
            borderRadius: 80,
            borderColor: '#8c00d1',
            borderWidth: 2,
            backgroundColor: '#8c00d1',
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="aws" type={Icons.FontAwesome5} color="white" />
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.text}>AWS </Text>
            <Text style={styles.text}>configuration</Text>
          </View>

          <Icon
            style={{marginLeft: 20}}
            name="arrowright"
            type={Icons.AntDesign}
            color="black"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {alignItems: 'flex-start', paddingLeft: 15}]}
        activeOpacity={0.7}
        onPress={() => {
          handleNavigate('AZURE');
          // handleNavigate('Configuration GPS', {path: 'AZURE'});
        }}>
        <View
          style={{
            marginBottom: 15,
            borderRadius: 80,
            borderColor: '#8c00d1',
            borderWidth: 2,
            backgroundColor: '#8c00d1',
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name="microsoft-azure"
            type={Icons.MaterialCommunityIcons}
            color="white"
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.text}>AZURE </Text>
            <Text style={styles.text}>configuration</Text>
          </View>

          <Icon
            style={{marginLeft: 20}}
            name="arrowright"
            type={Icons.AntDesign}
            color="black"
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#fff',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 160,
    borderRadius: 10,
    backgroundColor: '#fff',
    //borderColor: 'rgba(116, 238, 21, 0.76)',
    //borderWidth: 2,
    shadowColor: 'rgba(165, 165, 165, 1)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 10,
    transitionDuration: '0.5s',
  },
  text: {
    color: '#393939',
    fontSize: 17,
    //textShadowColor: '#393939',
    // textShadowOffset: {width: 0, height: 0},
    //textShadowRadius: 10,
    fontWeight: '600',
  },
});

export default Services;
