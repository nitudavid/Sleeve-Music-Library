import styled from "styled-components";
import {Dimensions, Image, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {
    AlbumTouchable,
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle, MainContainer, ProfilePicture,
    SortButton,
    Spacer,
    StyledBackground
} from "../../components/Styles";
import React, {useCallback, useEffect, useState} from "react";
import {CustomButton} from "../../components/CustomButton";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useAuth} from "../../hooks/AuthProvider";
import {GET_USER_ALBUM_REVIEW, GET_USERS, UPDATE_ALBUM, UPDATE_FOLLOW} from "../../api/User";
import {useQuery} from "react-query";
import {Ionicons} from "@expo/vector-icons";
import {BASE} from "../../api/Index";


const FriendsProfile = () => {
    const myUser = useAuth()
    const navigation = useNavigation();
    const route = useRoute();
    const [albums, setAlbums] = useState([null, null, null, null, null, null]);
    const [isFollowing, setIsFollowing] = useState(0)
    const user = route.params
    const userID = user.user.data.id
    const username = user.user.data.attributes.username
    const [profilePicture, setProfilePicture] = useState('')

    const checkIfFollowing = useCallback(async () => {
        try {
            const response = await GET_USERS({ id: myUser.user.id });
            if (response && response.length > 0) {
                const user = response[0];
                if (user.following && user.following.length > 0) {
                    const isUserFollowing = user.following.some(followingUser => followingUser.id === userID);
                    setIsFollowing(isUserFollowing ? 1 : 0);
                } else {
                    setIsFollowing(0);
                }
            }
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    }, [myUser, userID]);

    const fetchProfilePicture = useCallback(async () => {
        try {
            const response = await GET_USERS({ id: userID });
            if (response && response.length > 0 && response[0].profilePicture && response[0].profilePicture.url !== null) {
                const fetchedProfilePicture = response[0].profilePicture.url;
                setProfilePicture(fetchedProfilePicture);
            } else {
                // Set profile picture to a default image or null if no profile picture is available
                setProfilePicture(null);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    }, [userID]);

    const fetchFavoriteAlbums = useCallback(async () => {
        try {
            const albumReviews = await GET_USER_ALBUM_REVIEW(userID, { favorite: { $ne: null } });
            const favoriteAlbums = albumReviews.data.filter((albumReview) => albumReview.attributes.favorite !== null);

            const album1 = favoriteAlbums.find((review) => review.attributes.favorite === 1)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 1).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 1).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 1).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 1).attributes.artistName,
                }
                : null;

            const album2 = favoriteAlbums.find((review) => review.attributes.favorite === 2)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 2).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 2).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 2).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 2).attributes.artistName,
                }
                : null;

            const album3 = favoriteAlbums.find((review) => review.attributes.favorite === 3)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 3).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 3).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 3).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 3).attributes.artistName,
                }
                : null;

            const album4 = favoriteAlbums.find((review) => review.attributes.favorite === 4)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 4).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 4).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 4).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 4).attributes.artistName,
                }
                : null;

            const album5 = favoriteAlbums.find((review) => review.attributes.favorite === 5)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 5).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 5).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 5).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 5).attributes.artistName,
                }
                : null;

            const album6 = favoriteAlbums.find((review) => review.attributes.favorite === 6)
                ? {
                    reviewID: favoriteAlbums.find((review) => review.attributes.favorite === 6).id,
                    albumID: favoriteAlbums.find((review) => review.attributes.favorite === 6).attributes.albumID,
                    albumCover: favoriteAlbums.find((review) => review.attributes.favorite === 6).attributes.albumCover,
                    albumArtist: favoriteAlbums.find((review) => review.attributes.favorite === 6).attributes.artistName,
                }
                : null;

            setAlbums([album1, album2, album3, album4, album5, album6]);
        } catch (error) {
            console.error('Error fetching favorite albums:', error);
        }
    }, [user.user.data.id]);

    useFocusEffect(
        useCallback(() => {
            fetchFavoriteAlbums();
            checkIfFollowing();
            fetchProfilePicture();
        }, [fetchFavoriteAlbums, checkIfFollowing, fetchProfilePicture])
    );

    useEffect(() => {
        fetchFavoriteAlbums();
        checkIfFollowing();
        fetchProfilePicture();
    }, [fetchFavoriteAlbums, checkIfFollowing, fetchProfilePicture]);

    const onFollowing = () => {
        navigation.navigate('FollowingList', { userID: userID });
    }

    const onFollowers = () => {
        navigation.navigate('FollowersList', { userID: userID });
    }

    const handleButtonPress = (buttonID) => {
        const albumData = albums[buttonID - 1];
        if (albumData) {
            navigation.navigate('AlbumPage', { albumID: albumData.albumID });
    }}
    const handleFollow = async () => {
        try {
            // Fetch the current user's data
            const currentUserResponse = await GET_USERS({ id: myUser.user.id });
            const currentUser = currentUserResponse[0];

            // Fetch the target user's data
            const targetUserResponse = await GET_USERS({ id: userID });
            const targetUser = targetUserResponse[0];

            // Extract list of IDs for following and followers
            const currentUserFollowingIDs = currentUser.following.map(user => user.id);
            const targetUserFollowerIDs = targetUser.followers.map(user => user.id);
            console.log(currentUserFollowingIDs)
            if (isFollowing === 0) {
                // User is not currently following, so we add the target user to the following list
                const updatedFollowing = [...currentUserFollowingIDs, userID]; // Add target user ID to following list
                const updatedFollowers = [...targetUserFollowerIDs, myUser.user.id]; // Add current user ID to followers list

                // Update current user's following list
                await UPDATE_FOLLOW(myUser.user.id, { "following": updatedFollowing });
                // Update target user's followers list
                await UPDATE_FOLLOW(userID, { "followers": updatedFollowers });

                setIsFollowing(1); // Update state to reflect the new following status

            } else {
                // User is currently following, so we remove the target user from the following list
                const updatedFollowing = currentUserFollowingIDs.filter(followingID => followingID !== userID);
                const updatedFollowers = targetUserFollowerIDs.filter(followerID => followerID !== myUser.user.id);

                // Update current user's following list
                await UPDATE_FOLLOW(myUser.user.id, { "following": updatedFollowing });
                // Update target user's followers list
                await UPDATE_FOLLOW(userID, { "followers": updatedFollowers });

                setIsFollowing(0); // Update state to reflect the new following status
            }

        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };


    return(
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent}/>
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>{username}</HeaderTitle>
                <SortButton onPress={handleFollow}>
                    {!isFollowing ? (
                        <Ionicons name="person-add-outline" size={30} color={Colors.alb} />
                    ) : (
                        <Ionicons name="person-remove-outline" size={30} color={Colors.alb} />
                    )}
                </SortButton>
            </HeaderContainer>
            <Spacer top={20}/>
            <MainContainer>
                {profilePicture ? (
                    <ProfilePicture source={{ uri: `${BASE}${profilePicture}` }} />
                ) : (
                    <ProfilePicture source={require("../../../assets/doodle-girl-listening-music-with-headset-Graphics-78469635-1.jpg")} />
                )}
            </MainContainer>
            <Spacer top={40}/>
            <ButtonContainer>
                {[1, 2, 3, 4, 5, 6].map((buttonID) => (
                    <ButtonTouchable
                        key={buttonID}
                        onPress={() => handleButtonPress(buttonID)}
                    >
                        {albums[buttonID - 1] ? (
                            <AlbumImage source={{ uri: albums[buttonID - 1].albumCover }} />
                        ) : (
                            <Ionicons name="disc-sharp" size={24} color={Colors.alb} />
                        )}
                    </ButtonTouchable>
                ))}
            </ButtonContainer>
            <Spacer top={20}/>
            <CustomButton
                label = 'Following'
                onPress={() => onFollowing()}
            />
            <Spacer top={20}/>
            <CustomButton
                label = 'Followers'
                onPress={() => onFollowers()}
            />
        </StyledBackground>
    );
}

const ButtonContainer = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const ButtonTouchable = styled(TouchableOpacity)`
    width: ${(Dimensions.get('window').width / 3) - 6}px;
    height: ${(Dimensions.get('window').width / 3) - 6}px;
    background-color: ${Colors.fundal};
    margin: 3px;
    justify-content: center;
    align-items: center;
`;

const AlbumImage = styled(Image)`
    width: 100%;
    height: 100%;
`;

export default FriendsProfile;