import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from "react-native";
import { BackButton, Colors, HeaderContainer, HeaderTitle, SortButton } from "./Styles";

const HeaderAlbumList = ({ title }) => {
    const navigation = useNavigation();

    const handleSortPress = () => {
        navigation.navigate('SortPage'); // Navigate to the SortPage
    };

    return (
        <HeaderContainer>
            <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color={Colors.alb}/>
            </BackButton>
            <SortButton onPress={handleSortPress}>
                <Ionicons name="options-outline" size={30} color={Colors.alb}/>
            </SortButton>
            <HeaderTitle>{title}</HeaderTitle>
        </HeaderContainer>
    );
};

export default HeaderAlbumList;
