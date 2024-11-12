import React, { useState } from "react";
import {
    Text,
    StatusBar,
    Keyboard,
    TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import {
    Colors, ErrorText,
    RedirectText, RedirectTextLink, RedirectTextLinkContent, RedirectTextView, Spacer,
    StyledBackground
} from '../../components/Styles';

import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";

import { useNavigation } from "@react-navigation/native";

import { GET_ME, LOGIN, REGISTER_USER } from "../../api/User";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/AuthProvider";
import { useQuery, useMutation } from "react-query";

const error = "Required field";

const schema = yup
    .object({
        username: yup.string().required(error),
        nume: yup.string().required(error),
        prenume: yup.string().required(error),
        password: yup
            .string()
            .min(8, "Password must include at least 8 characters.")
            .required(error),
        email: yup
            .string()
            .email("Email is not valid.")
            .required(error),
    })
    .required();

const SignupPage = () => {
    const { addUser } = useAuth();
    const [jwt, setJwt] = useState(false);

    const {
        getValues,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

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

    const loginMutation = useMutation(
        async () => {
            return LOGIN(getValues("email"), getValues("password"));
        },
        {
            onSuccess: async (data) => {
                console.log("Login success:", data);
                await AsyncStorage.setItem('jwtToken', data?.data?.jwt);
                setJwt(true);
            },
        }
    );

    const mutation = useMutation({
        mutationFn: (payload) => {
            console.log("Registering user with payload:", payload);
            return REGISTER_USER(payload);
        },
        onSuccess: (data) => {
            console.log("Register success:", data);
            loginMutation.mutate();
        },
    });

    const onSubmit = (data) => {
        console.log("Form data on submit:", data);
        mutation.mutate(data);
    };

    const navigation = useNavigation();

    const onLoginRedirectPressed = () => {
        navigation.navigate('LogIn');
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <KeyboardAvoidingView
                    behavior="height" // More stable behaviors
                    style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <Spacer top={40}/>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInput
                            label='Email'
                            placeholder='Enter your email...'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="email"
                />
                <ErrorText>{errors.email?.message}</ErrorText>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInput
                            label='Username'
                            placeholder='Enter your username...'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="username"
                />
                <ErrorText>{errors.username?.message}</ErrorText>

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInput
                            label='Name'
                            placeholder='Enter your name...'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="prenume"
                />
                <ErrorText>{errors.prenume?.message}</ErrorText>

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInput
                            label='Surname'
                            placeholder='Enter your surname...'
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="nume"
                />
                <ErrorText>{errors.nume?.message}</ErrorText>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <CustomInput
                            label='Password'
                            placeholder='************'
                            isPassword
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="password"
                />
                <ErrorText>{errors.password?.message}</ErrorText>
                <CustomButton
                    label='Sign Up'
                    onPress={handleSubmit(onSubmit)}
                />
                <RedirectTextView>
                    <RedirectText>Already have an account?  </RedirectText>
                    <RedirectTextLink onPress={onLoginRedirectPressed}>
                        <RedirectTextLinkContent>Log In</RedirectTextLinkContent>
                    </RedirectTextLink>
                </RedirectTextView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </StyledBackground>
        </TouchableWithoutFeedback>

    );
}

export default SignupPage;
