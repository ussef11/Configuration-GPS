/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Badge, Surface, Text, Title} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Icon, {Icons} from '../icons/icons';
import {useNavigation} from '@react-navigation/native';

const IconSize = 24;

const AppHeader = ({
  style,
  menu,
  onPressMenu,
  back,
  onPressBack,
  title,
  right,
  rightComponent,
  onRightPress,
  optionalBtn,
  optionalBtnPress,
  headerBg = 'white',
  iconColor = 'black',
  titleAlight,
  optionalBadge,
  onPressToggleDrawer,
  onPressCloseDrawer,
  textStyle,
}) => {
  const navigation = useNavigation();
  const LeftView = () => (
    <View style={styles.view}>
      {!back ? (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
                <Icon name="setting" type={Icons.AntDesign} size={IconSize} color={iconColor}  />
   
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPressBack}>
          <Icon name="arrow-back" type={Icons.MaterialIcons} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
  const RightView = () =>
    rightComponent ? (
      rightComponent
    ) : (
      <View style={[styles.view, styles.rightView]}>
        {/* <TouchableOpacity style={styles.rowView} onPress={optionalBtnPress}>
					<Image source={require('../../media/live.png')} style={{width:23 , height:23}} />
					</TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.rowView} onPress={optionalBtnPress}>
          <Image
            source={require('../media/search.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity> */}
        {/* {right !== '' && <TouchableOpacity onPress={onRightPress}>
						<Image source={require('../../media/Vector.png')} style={{width:23 , height:23}}    />
					</TouchableOpacity>
					} */}
      </View>
    );
  const TitleView = () => (
    <View style={[styles.titleView, {alignItems: 'center'}]}>
      <Text style={[{color: iconColor, textAlign: titleAlight}, textStyle]}>
        {title}
      </Text>
    </View>
  );
  return (
    <Surface style={[styles.header, style, {backgroundColor: headerBg}]}>
      <RightView />
      <TitleView />

      <LeftView />
    </Surface>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    height: 50,
    elevation: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    // marginBottom :10
  },
  view: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
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
});
