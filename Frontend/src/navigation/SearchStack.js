import { createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import React from "react";

import SearchPage from "../pages/loggedInUser/SearchPage";
import ArtistPage from "../pages/loggedInUser/ArtistPage";
import AlbumPage from "../pages/loggedInUser/AlbumPage";
import FriendsProfile from "../pages/loggedInUser/FriendsProfile";
import FollowingList from "../pages/loggedInUser/FollowingList";
import FollowersList from "../pages/loggedInUser/FollowersList";

const Stack = createStackNavigator();

const SearchStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
            headerShown: false,
            animationEnabled: false
        }}
            initialRouteName={SearchPage}
        >
            <Stack.Screen name="Search" component={SearchPage} />
            <Stack.Screen name="ArtistPage" component={ArtistPage} />
            <Stack.Screen name="AlbumPage" component={AlbumPage} />
            <Stack.Screen name="FriendsProfile" component={FriendsProfile} />
            <Stack.Screen name="FollowingList" component={FollowingList} />
            <Stack.Screen name="FollowersList" component={FollowersList} />
        </Stack.Navigator>
    );
}

export default SearchStack;