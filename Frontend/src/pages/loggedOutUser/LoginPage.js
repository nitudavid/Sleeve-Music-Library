import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';

import {
    StyledBackground,
    RedirectTextView,
    RedirectText,
    RedirectTextLink,
    RedirectTextLinkContent,
    Colors, Spacer
} from '../../components/Styles';

import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";

import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "react-query";
import { GET_ME, LOGIN } from "../../api/User";
import { useAuth } from "../../hooks/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = () => {
    const [identifier, setIdentifier] = useState(""); // Changed from 'email' to 'identifier'
    const [password, setPassword] = useState("");
    const [jwt, setJwt] = useState(false);
    const { addUser } = useAuth();

    useQuery(
        ["GET_ME"],
        async () => {
            return GET_ME();
        },
        {
            staleTime: 0,
            cacheTime: 0,
            enabled: !!jwt,
            onSuccess: async (data) => {
                await addUser(data.data);
            },
        }
    );

    const mutation = useMutation(
        async (userData) => {
            console.log(userData)
            return LOGIN(userData.identifier, userData.password);
        },
        {
            onSuccess: async (data) => {
                await AsyncStorage.setItem('jwtToken', data?.data?.jwt);
                setJwt(true);
            },
        }
    );

    const onLogin = () => {
        mutation.mutate({ identifier, password }); // Changed 'email' to 'identifier'
    };

    const navigation = useNavigation();

    const onSignupRedirectPressed = () => {
        navigation.navigate('SignUp');
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <Spacer top={50}/>
                <CustomInput
                    label='Username or Email' // Changed label to indicate both username and email
                    value={identifier} // Changed from 'email' to 'identifier'
                    onChangeText={(text) => setIdentifier(text)} // Changed from 'setEmail' to 'setIdentifier'
                    placeholder='Enter your credentials...' // Updated placeholder text
                />
                <Spacer top={20}/>
                <CustomInput
                    label='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder='************'
                    isPassword
                />
                <Spacer top={30}/>
                <CustomButton
                    label='Log in'
                    disabled={!identifier || !password} // Changed from '!email' to '!identifier'
                    loading={mutation.isLoading || mutation.isSuccess}
                    onPress={onLogin}
                />
                <Spacer top={20}/>
                <RedirectTextView>
                    <RedirectText>Don't have an account?  </RedirectText>
                    <RedirectTextLink onPress={onSignupRedirectPressed}>
                        <RedirectTextLinkContent>Signup</RedirectTextLinkContent>
                    </RedirectTextLink>
                </RedirectTextView>
                <Spacer top={5}/>
                <RedirectTextView>
                    <RedirectText>Forgot Password?  </RedirectText>
                    <RedirectTextLink onPress={onSignupRedirectPressed}>
                        <RedirectTextLinkContent>Reset Password</RedirectTextLinkContent>
                    </RedirectTextLink>
                </RedirectTextView>
            </StyledBackground>
        </TouchableWithoutFeedback>
    );
}

export default LoginPage;
