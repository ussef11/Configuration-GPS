import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';

const SoccerText = ({style, ...props}) => {
  return <RNText style={[styles.text, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins',
  },
});

export default SoccerText;
