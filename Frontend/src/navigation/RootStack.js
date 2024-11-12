import { createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useAuth} from "../hooks/AuthProvider";

import React from "react";

import LoginPage from "../pages/loggedOutUser/LoginPage";
import SignupPage from "../pages/loggedOutUser/SignupPage";
import TabStack from "./TabStack";

const Stack = createStackNavigator();

const RootStack = () => {
    const {user} = useAuth();
    console.log("--->", user);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
                animationEnabled: false
            }}>
                {user ?
                    <Stack.Screen name="Root" component={TabStack} />
                    : (
                        <>
                            <Stack.Screen name="LogIn" component={LoginPage} />
                            <Stack.Screen name="SignUp" component={SignupPage} />
                        </>
                    )}

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;