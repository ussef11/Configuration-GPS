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
    </Stack.Navigator>
  );
};

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Icons.MaterialIcons,
    icon: 'live-tv',
    component: HomeScreens,
    tabBarColor: Colors.tab1,
  },
  {
    route: 'Settings',
    label: 'Settings',
    type: Icons.MaterialIcons,
    icon: 'sports-soccer',
    component: HomeScreen,
    tabBarColor: Colors.tab2,
  },
  {
    route: 'Network',
    label: 'Network',
    type: Icons.MaterialIcons,
    icon: 'sports-soccer',
    component: HomeScreen,
    tabBarColor: '#ffff',
  },
  {
    route: 'Profile',
    label: 'Settings',
    type: Icons.MaterialIcons,
    icon: 'sports-soccer',
    component: SettingsScreen,
    tabBarColor: '#ffff',
  },
];

const Tab = createBottomTabNavigator();

const TabsNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
        },
        tabBarActiveTintColor: '#ffff',
        tabBarInactiveTintColor: '#cfcfcf',
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
