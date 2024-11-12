import { createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import React from "react";

import ListenedToList from "../pages/loggedInUser/ListenedToList";
import ProfilePage from "../pages/loggedInUser/ProfilePage";
import WantToListenToList from "../pages/loggedInUser/WantToListenToList";
import HeaderAlbumList from "../components/HeaderAlbumList";
import AlbumPage from "../pages/loggedInUser/AlbumPage";
import ArtistPage from "../pages/loggedInUser/ArtistPage";
import SortPage from "../pages/loggedInUser/SortPage";
import SettingsPage from "../pages/loggedInUser/SettingsPage";
import FriendsProfile from "../pages/loggedInUser/FriendsProfile";
import FollowingList from "../pages/loggedInUser/FollowingList";
import FollowersList from "../pages/loggedInUser/FollowersList";
const Stack = createStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animationEnabled: false,}}>
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="ListenedToList" component={ListenedToList} />
            <Stack.Screen name="WantToListenToList" component={WantToListenToList} />
            <Stack.Screen name="AlbumPage" component={AlbumPage} />
            <Stack.Screen name="ArtistPage" component={ArtistPage} />
            <Stack.Screen name="SortPage" component={SortPage} />
            <Stack.Screen name="SettingsPage" component={SettingsPage} />
            <Stack.Screen name="FriendsProfile" component={FriendsProfile} />
            <Stack.Screen name="FollowingList" component={FollowingList} />
            <Stack.Screen name="FollowersList" component={FollowersList} />
        </Stack.Navigator>
    );
}

export default ProfileStack;