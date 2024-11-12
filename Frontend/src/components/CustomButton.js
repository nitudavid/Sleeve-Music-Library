import styled from "styled-components";
import {View, Text, TextInput, StyleSheet} from "react-native";
import Constants from "expo-constants";
import {
    StyledButton,
    StyledButtonText
} from "./Styles";

export const CustomButton = ({label, onPress}) => {
    return(
        <View>
            <StyledButton onPress={onPress}>
                <StyledButtonText>
                    {label}
                </StyledButtonText>
            </StyledButton>
        </View>
    );
}
