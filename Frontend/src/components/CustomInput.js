import styled from "styled-components";
import {View, Text, TextInput, StyleSheet} from "react-native";
import Constants from "expo-constants";
import {
    StyledInputLabel,
    StyledTextInput,
    StyledShowPass, Colors
} from "./Styles";
import {useState} from "react";
import {Ionicons} from "@expo/vector-icons"
export const CustomInput = ({label, placeholder, isPassword, ...rest }) => {
    const [hidePassword, setHidePassword] = useState(isPassword);

    return(
    <View>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput
            {...rest}
            placeholder={isPassword ? (hidePassword ? placeholder : "Enter your password...") : placeholder}
            placeholderTextColor= {Colors.gri}
            cursorColor={Colors.alb}
            autoCapitalize={"none"}
            secureTextEntry={hidePassword}
        />
        {isPassword && (
            <StyledShowPass onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons name={hidePassword ? "eye-off-outline" : "eye-outline"} size={28} color={Colors.aprins}/>
            </StyledShowPass>
        )}
    </View>
    );
}
