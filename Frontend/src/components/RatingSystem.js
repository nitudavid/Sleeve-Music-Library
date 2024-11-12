// import React, { useState, useRef } from 'react';
// import { View, StyleSheet, PanResponder } from 'react-native';
// import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';
//
// const Rating = () => {
//     const [rating, setRating] = useState(0);
//     const circleRadius = 50;
//     const innerRadius = 40;
//     const maxRating = 10;
//     const angleStep = 360 / maxRating;
//     const strokeWidth = 10;
//
//     const panResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onPanResponderGrant: (evt, gestureState) => {
//                 handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
//             },
//             onPanResponderMove: (evt, gestureState) => {
//                 handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
//             },
//         })
//     ).current;
//
//     const handleTouch = (x, y) => {
//         const xRelative = x - (circleRadius + strokeWidth);
//         const yRelative = y - (circleRadius + strokeWidth);
//         const distance = Math.sqrt(xRelative * xRelative + yRelative * yRelative);
//
//         if (distance < circleRadius + strokeWidth && distance > innerRadius) {
//             const angle = (Math.atan2(yRelative, xRelative) * 180) / Math.PI + 180;
//             const newRating = Math.ceil(angle / angleStep) || 1;
//             setRating(newRating);
//         }
//     };
//
//     const getCircleColor = (value) => {
//         const colors = [
//             '#4D8FAC', '#5145A5', '#7C41A5', '#AF419C', '#D53A5D',
//             '#EB5B3E', '#F59D3D', '#FFB039', '#89C240', '#31A086'
//         ];
//         return colors[value - 1];
//     };
//
//     const createCircleSegments = () => {
//         const segments = [];
//         const fillColor = getCircleColor(rating);
//         for (let i = 0; i < maxRating; i++) {
//             const startAngle = i * angleStep;
//             const endAngle = startAngle + angleStep;
//             const largeArcFlag = angleStep > 180 ? 1 : 0;
//             const x1 = circleRadius + circleRadius * Math.cos(Math.PI * startAngle / 180);
//             const y1 = circleRadius + circleRadius * Math.sin(Math.PI * startAngle / 180);
//             const x2 = circleRadius + circleRadius * Math.cos(Math.PI * endAngle / 180);
//             const y2 = circleRadius + circleRadius * Math.sin(Math.PI * endAngle / 180);
//             const pathData = `
//                 M ${circleRadius} ${circleRadius}
//                 L ${x1} ${y1}
//                 A ${circleRadius} ${circleRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
//                 Z
//             `;
//             segments.push(
//                 <Path
//                     key={i}
//                     d={pathData}
//                     fill={i < rating ? fillColor : 'gray'}
//                     stroke="none"
//                     strokeWidth={strokeWidth}
//                 />
//             );
//         }
//         return segments;
//     };
//
//     return (
//         <View style={styles.container} {...panResponder.panHandlers}>
//             <Svg height="120" width="120" viewBox="0 20 100 100">
//                 <G rotation={-90} origin="60, 60">
//                     {createCircleSegments()}
//                 </G>
//                 <Circle cx="50" cy="70" r="38" fill="#FFF7F1" />
//                 <SvgText
//                     x="50"
//                     y="70"
//                     textAnchor="middle"
//                     alignmentBaseline="middle"
//                     fontSize="24"
//                     fill="black"
//                 >
//                     {rating}
//                 </SvgText>
//             </Svg>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
//
// export default Rating;
