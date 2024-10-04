/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon, {Icons} from '../icons/icons';
import Colors from '../constants/colors';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyHeader from '../component/Header';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ScanImei from '../Screens/ScanImei';
import BleScreen from '../Screens/BleScreen';
import ChooseConf from '../Screens/ChooseConf';
import WifiConf from '../Screens/WifiConf';
import TestTrams from '../Screens/TestTrams';
import Services from '../Screens/Services/Services';
import Aws from '../Screens/Services/Aws';
import ConfigGps from '../Screens/ConfigGPS/ConfigGps';
import SimConf from '../Screens/SimConf';
const HomeScreen = ({route, navigation}) => {
  useEffect(() => {
    console.log('hrrme');
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <MyHeader
        title={'Home'}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black'}}>Home!</Text>
      </View>
    </SafeAreaView>
  );
};

const SettingsScreen = ({route, navigation}) => {
  useEffect(() => {
    console.log('SettingsScreen');
  }, []);
  return (
    <SafeAreaView>
      <MyHeader
        title={'Settings'}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: 500,
          backgroundColor: 'black',
        }}>
        <Text style={{color: 'black'}}>Hoeeeeeeeeeeeeeeeeeeeme!</Text>
      </View>
    </SafeAreaView>
  );
};
const MainLeague = ({route, navigation}) => {
  return (
    <SafeAreaView>
      <MyHeader
        title={'MainLeague'}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black'}}>MainLesssssssague!</Text>
      </View>
    </SafeAreaView>
  );
};
const DetailsLeague = ({route, navigation}) => {
  return (
    <SafeAreaView>
      <MyHeader
        title={'DetassssssilsLeague'}
        onPressToggleDrawer={() => navigation.toggleDrawer()}
      />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'black'}}>DetailsLeague!</Text>
      </View>
    </SafeAreaView>
  );
};

const HomeScreens = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Scan Imei" component={ScanImei} />
      <Stack.Screen name="Bluetooth" component={BleScreen} />
      <Stack.Screen name="Network" component={ChooseConf} />
      <Stack.Screen name="Wifi configuration" component={WifiConf} />
      <Stack.Screen name="Verify Comming Data" component={TestTrams} />
      <Stack.Screen name="Choose Services" component={Services} />
      <Stack.Screen name="AWS IOT" component={Aws} />
      <Stack.Screen name="Configuration GPS" component={ConfigGps} />
      <Stack.Screen name="SIM Configuration" component={SimConf} />
    </Stack.Navigator>
  );
};

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Icons.FontAwesome,
    icon: 'bluetooth',
    component: HomeScreens,
    tabBarColor: '#0000',
  },
  {
    route: 'Settings',
    label: 'Settings',
    type: Icons.FontAwesome,
    icon: 'wifi',
    component: HomeScreen,
    tabBarColor: '#0000',
  },
  {
    route: 'Network',
    label: 'Network',
    type: Icons.FontAwesome,
    icon: 'wifi',
    component: HomeScreen,
    tabBarColor: '#0000',
  },
  {
    route: 'Profile',
    label: 'Settings',
    type: Icons.FontAwesome,
    icon: 'wifi',
    component: SettingsScreen,
    tabBarColor: '#0000',
  },
];

const Tab = createBottomTabNavigator();

const TabsNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          zIndex: 0,
          backgroundColor: '#ffff',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          overflow: 'hidden',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 3,
          height: 60,
          paddingBottom: 5,
          margin: 5,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({color, size}) => {
          const {icon, type} = TabArr.find(item => item.route === route.name);
          return <Icon name={icon} type={type} size={size} color={color} />;
        },
      })}>
      {TabArr.map((_, index) => (
        <Tab.Screen
          key={index}
          name={_.route}
          component={_.component}
          options={({route}) => ({
            tabBarColor: _.tabBarColor,
            tabBarIcon: ({color, size}) => (
              <Icon name={_.icon} type={_.type} size={size} color={color} />
            ),
            animationEnabled: false,
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabsNavigation;
