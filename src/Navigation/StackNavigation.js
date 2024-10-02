/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabsNavigation from './TabsNavigation';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerView from '../component/DrawerView';
import {BlurView} from '@react-native-community/blur';
import {ConfContext} from '../Helper/ConfContext';

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
  const {addBlur, setAddblur} = useContext(ConfContext);

  return (
    <View style={Styles.container}>
      {addBlur && (
        <BlurView
          style={Styles.absolute}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
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
  absolute: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default MainStack;
