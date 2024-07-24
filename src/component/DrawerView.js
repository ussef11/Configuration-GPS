import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';

const DrawerView = props => {
  const {navigation} = props;

  return (
    <DrawerContentScrollView style={{backgroundColor: 'black'}} {...props}>
      <View>
        <TouchableOpacity
          style={styles.view}
          onPress={() => navigation.navigate('Notifications')}>
          <Text style={[styles.text, {}]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.view}
          onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.text, {}]}>Home</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    elevation: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    marginBottom: 10,
  },
  view: {
    backgroundColor: 'black',
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  titleView: {
    flex: 1,
  },
  rightView: {
    justifyContent: 'flex-end',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 10,
  },

  text: {
    color: '#fff',
  },
});

export default DrawerView;
