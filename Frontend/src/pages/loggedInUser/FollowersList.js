import styled from "styled-components";
import {ActivityIndicator, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle, ResultButton, ResultImage,
    SearchBar, SmallerMainName,
    SortButton, Spacer,
    StyledBackground
} from "../../components/Styles";
import React, {useCallback, useEffect, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useAuth} from "../../hooks/AuthProvider";
import {CustomButton} from "../../components/CustomButton";
import {GET_USERS} from "../../api/User";
import {BASE} from "../../api/Index";

const FollowersList = () => {
    const navigation = useNavigation();
    const myUser = useAuth()
    const route = useRoute();
    const userID = route.params.userID;
    const [username, setUsername] = useState('');
    const [followers, setFollowers] = useState([]);
    const [profilePictures, setProfilePictures] = useState([]);
    const [loadingPictures, setLoadingPictures] = useState(false);

    const getUserFollowers = useCallback(async () => {
        try {
            const response = await GET_USERS({ id: userID });
            setUsername(response[0].username)
            const followers = response[0].followers;
            setFollowers(followers);
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    }, [userID]);

    const fetchProfilePicture = useCallback(async (userID) => {
        try {
            const response = await GET_USERS({ id: userID });
            if (response && response.length > 0 && response[0].profilePicture && response[0].profilePicture.url !== null) {
                return response[0].profilePicture.url;
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
        return null; // Return null if profile picture is not available
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingPictures(true); // Set loading to true when fetching starts
            if (followers && followers.length > 0) {
                const promises = followers.map(user => fetchProfilePicture(user.id));
                const profilePictureUrls = await Promise.all(promises);
                setProfilePictures(profilePictureUrls);
                setLoadingPictures(false); // Set loading to false when fetching ends
            }
        };
        fetchData();
    }, [followers, fetchProfilePicture]);

    useFocusEffect(
        useCallback(() => {
            getUserFollowers();
        }, [getUserFollowers])
    );

    useEffect(() => {
        getUserFollowers();
    }, [getUserFollowers]);

    const handleUserPress = (userId, username) => {
        if(userId === myUser.user.id){

        }else{
            navigation.navigate('FriendsProfile', { user: { data: { id: userId, attributes: { username: username } } } });
        }
    };

    const renderUserItem = ({ item, index }) => (
        <ResultButton onPress={() => handleUserPress(item.id, item.username)}>
            {loadingPictures ? ( // Display ActivityIndicator while loading
                <ActivityIndicator size="small" color={Colors.accent} />
            ) : (
                <ResultImage
                    source={profilePictures[index] ? { uri: `${BASE}${profilePictures[index]}` } : require("../../../assets/doodle-girl-listening-music-with-headset-Graphics-78469635-1.jpg")}
                />
            )}
            <Spacer left={20} />
            <SmallerMainName>{item.username}</SmallerMainName>
        </ResultButton>
    );

    return(
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent}/>
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>{username}'s followers</HeaderTitle>
            </HeaderContainer>
            <Spacer top={12}/>
            <FlatList
                data={followers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </StyledBackground>
    );
}

export default FollowersList;