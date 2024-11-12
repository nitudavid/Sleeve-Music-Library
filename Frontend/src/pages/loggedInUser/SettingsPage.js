import styled from "styled-components";
import {Alert, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle,
    SearchBar,
    SortButton, Spacer,
    StyledBackground
} from "../../components/Styles";
import React, {useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../hooks/AuthProvider";
import {CustomButton} from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import {UPDATE_FOLLOW, UPLOAD_IMAGE} from "../../api/User";
const SettingsPage = () => {
    const {removeUser} = useAuth()
    const {user} = useAuth();
    console.log(user.password)
    const navigation = useNavigation();

    return(
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent}/>
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>Settings</HeaderTitle>
            </HeaderContainer>
            <Spacer top={30}/>
            <CustomButton
                label = 'Log out'
                onPress={() => removeUser()}
            />
        </StyledBackground>
    );
}

export default SettingsPage;