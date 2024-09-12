import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MyHeader from '../../component/Header';
import Icon, {Icons} from '../../icons/icons';

const Services = ({route, navigation}) => {
  const handlePress = async service => {
    console.log(service);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {marginBottom: 20}]}
        activeOpacity={0.7}
        onPress={handlePress}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.text, {position: 'relative', top: 2}]}>
            AWS IOT{' '}
          </Text>
          <Icon
            name="aws"
            size={40}
            type={Icons.MaterialCommunityIcons}
            color="white"
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {marginBottom: 20}]}
        activeOpacity={0.7}
        onPress={handlePress}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.text, {position: 'relative', top: 0}]}>
            AZUR IOT{' '}
          </Text>
          <Icon
            name="microsoft-azure"
            size={30}
            type={Icons.MaterialCommunityIcons}
            color="white"
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
    backgroundColor: '#fff',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 60,
    borderRadius: 10,
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
export default Services;
