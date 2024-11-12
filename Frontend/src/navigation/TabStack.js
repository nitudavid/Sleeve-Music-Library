import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import React from "react";
import { View, Dimensions } from 'react-native'
import ProfileStack from "./ProfileStack";
import SearchStack from "./SearchStack";
import HomeStack from "./HomeStack";
import { Colors } from "../components/Styles";

const { width, height } = Dimensions.get("window")
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => {
    return (
        <View style={{
            width,
            height,
        }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.alb,
                    unmountOnBlur: true,
                    tabBarStyle: {
                        backgroundColor: Colors.accent,
                        height: 70,
                        margin: 0,
                        padding: 0,
                        borderTopWidth: 0,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 9,
                    },
                }}
                backBehavior='order'>
                <Tab.Screen
                    name="HomeStack"
                    component={HomeStack}
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "home" : "home-outline"} size={32} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="SearchStack"
                    component={SearchStack}
                    options={{
                        tabBarLabel: "Search",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "search" : "search-outline"} size={32} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ProfileStack"
                    component={ProfileStack}
                    options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "person" : "person-outline"} size={32} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

export default TabStack;