import React from 'react';
import { Text } from 'react-native';
import Svg, { LinearGradient, Text as SvgText, Defs, Stop } from 'react-native-svg';

const GradientText = ({ children, style, gradientColors }) => {
  return (
    <Svg height="30" width="100%">
      <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
    <Stop offset="0" stopColor="#ff0000" stopOpacity="1" />
    <Stop offset="1" stopColor="#000000" stopOpacity="1" />
  </LinearGradient>
      <SvgText fill="url(#grad)" fontSize="24" fontWeight="bold">
        {children}
      </SvgText>
    </Svg>
  );
};

export default GradientText;
