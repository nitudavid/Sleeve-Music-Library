import { createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import React from "react";

import HomePage from "../pages/loggedInUser/HomePage";
import CreateList from "../pages/loggedInUser/CreateList";
import AddListAlbums from "../pages/loggedInUser/AddListAlbums";
import AlbumPage from "../pages/loggedInUser/AlbumPage";
import ArtistPage from "../pages/loggedInUser/ArtistPage";
import SortPage from "../pages/loggedInUser/SortPage";
import ListenedToList from "../pages/loggedInUser/ListenedToList";
import FriendsProfile from "../pages/loggedInUser/FriendsProfile";
import FollowingList from "../pages/loggedInUser/FollowingList";
import FollowersList from "../pages/loggedInUser/FollowersList";

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false,
            animationEnabled: false}}>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="CreateList" component={CreateList} />
            <Stack.Screen name="AddListAlbums" component={AddListAlbums} />
            <Stack.Screen name="AlbumPage" component={AlbumPage} />
            <Stack.Screen name="ArtistPage" component={ArtistPage} />
            <Stack.Screen name="SortPage" component={SortPage} />
            <Stack.Screen name="ListenedToList" component={ListenedToList} />
            <Stack.Screen name="FriendsProfile" component={FriendsProfile} />
            <Stack.Screen name="FollowingList" component={FollowingList} />
            <Stack.Screen name="FollowersList" component={FollowersList} />
        </Stack.Navigator>
    );
}

export default HomeStack;