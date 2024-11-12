import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './Styles';

const DiscRating = ({ rating, setRating, handleAddRating }) => {
    const [slideRating, setSlideRating] = useState(null);
    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan }], { useNativeDriver: false }),
            onPanResponderRelease: () => {
                // Calculate the slide rating based on the position of the slide
                const slidePosition = Math.floor(pan._value / 60);
                if (slidePosition < 0) {
                    setSlideRating(null); // If slide left of the first disc, set rating to null
                } else {
                    setSlideRating(slidePosition + 1); // Map slide position to rating value
                }
                pan.setValue(0); // Reset the slide position
            },
        })
    ).current;

    const handleRating = (star) => {
        setRating(star); // Set the rating state when a star is pressed
        handleAddRating(star); // Pass the star value to the handleAddRating function
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                    key={star}
                    onPress={() => handleRating(star)}
                    {...panResponder.panHandlers}
                >
                    <Animated.View style={{ transform: [{ translateX: pan }] }}>
                        <Ionicons
                            name={star <= (slideRating !== null ? slideRating : rating) ? 'disc' : 'disc-outline'}
                            size={45}
                            color={Colors.alb}
                        />
                    </Animated.View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default DiscRating;
