/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabsNavigation from './TabsNavigation';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerView from '../component/DrawerView';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Notifications({navigation}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}>
      <Button
        style={{color: 'black', backgroundColor: 'white'}}
        onPress={() => navigation.navigate('Home')}
        title="Details back home"
      />
    </View>
  );
}

const HomeScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
};

const MainStack = () => {
  return (
    <View style={Styles.container}>
      <Drawer.Navigator
        initialRouteName="Tabs"
        drawerContent={props => <DrawerView {...props} />}>
        <Drawer.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="Tabs"
          component={NestedStack}
          options={{headerShown: false}}
        />
      </Drawer.Navigator>
    </View>
  );
};

const NestedStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LiveStack" component={TabsNavigation} />
    </Stack.Navigator>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default MainStack;
