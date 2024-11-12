import styled from "styled-components";
import {Alert, Dimensions, Image, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {
    AlbumTouchable,
    Colors,
    HeaderContainer,
    HeaderTitle, MainContainer,
    MainImage, MainName,
    ProfilePicture, SearchChangeButton, SearchChangeButtonContainer,
    SortButton, Spacer,
    StyledBackground, StyledButtonText
} from "../../components/Styles";
import React, {useCallback, useEffect, useState} from "react";
import {CustomButton} from "../../components/CustomButton";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useAuth} from "../../hooks/AuthProvider";
import {GET_USER_ALBUM_REVIEW, GET_USERS, UPDATE_ALBUM, UPDATE_FOLLOW, UPLOAD_IMAGE} from "../../api/User";
import {useQuery} from "react-query";
import {Ionicons} from "@expo/vector-icons";
import {BASE} from "../../api/Index";
import * as ImagePicker from "expo-image-picker";


const ProfilePage = () => {
    const {user} = useAuth();

    const navigation = useNavigation();
    const [isEmpty, setIsEmpty] = useState([1, 1, 1, 1, 1, 1]);
    const [albums, setAlbums] = useState([null, null, null, null, null, null]);
    const [profilePicture, setProfilePicture] = useState('')

    const fetchProfilePicture = useCallback(async () => {
        try {
            const response = await GET_USERS({ id: user.id });
            if (response && response.length > 0 && response[0].profilePicture && response[0].profilePicture.url !== null) {
                setProfilePicture(response[0].profilePicture.url);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    }, [user.id]);

    const fetchFavoriteAlbums = useCallback(async () => {
        try {
            const albumReviews = await GET_USER_ALBUM_REVIEW(user.id, { favorite: { $ne: null } });
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
    }, [user.id]);

    useFocusEffect(
        useCallback(() => {
            fetchFavoriteAlbums();
            fetchProfilePicture();
        }, [fetchFavoriteAlbums, fetchProfilePicture])
    );

    useEffect(() => {
        fetchFavoriteAlbums();
        fetchProfilePicture();
    }, [fetchFavoriteAlbums, fetchProfilePicture]);

    const onListenedToList = () => {
        navigation.navigate('ListenedToList');
    }
    const onWantToListenToList = () => {
        navigation.navigate('WantToListenToList');
    }

    const onFollowing = () => {
        navigation.navigate('FollowingList', { userID: user.id });
    }

    const onFollowers = () => {
        navigation.navigate('FollowersList', { userID: user.id });
    }

    const handleSettingsPressed = () => {
        navigation.navigate('SettingsPage')
    }
    const handleButtonPress = (buttonID) => {
        const albumData = albums[buttonID - 1];
        if (albumData) {
            // Button is not empty, navigate to AlbumPage with albumID
            navigation.navigate('AlbumPage', { albumID: albumData.albumID });
        } else {
            // Button is empty, navigate to ListenedToList
            navigation.navigate('ListenedToList', { buttonID: buttonID, selectFavoriteMode: 1 });
        }
    };

    const handleLongPress = async (buttonID, reviewID) => {
        const albumData = albums[buttonID - 1];
        if (albumData) {
            try {
                await UPDATE_ALBUM(reviewID, { favorite: null });
                await fetchFavoriteAlbums();
            } catch (error) {
                console.error('Error updating album favorite:', error);
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            await handleUpload(result.assets[0].uri);
        }
    };

    const handleUpload = async (image) => {
        if (!image) {
            Alert.alert("Error", "Image or user not selected");
            return;
        }
        const formData = new FormData();
        formData.append("files", {
            uri: image,
            name: "photo.jpg",
            type: "image/jpeg",
        });
        try {
            const uploadResponse = await UPLOAD_IMAGE(formData);
            await UPDATE_FOLLOW(user.id, { profilePicture: uploadResponse[0].id})

            const response = await GET_USERS({ id: user.id });
            const updatedProfilePictureUrl = response[0].profilePicture.url;

            // Update the profilePicture state with the new URL
            setProfilePicture(updatedProfilePictureUrl);
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent}/>
            <HeaderContainer>
                <SortButton onPress={handleSettingsPressed}>
                    <Ionicons name="settings-outline" size={30} color={Colors.alb}/>
                </SortButton>
                <HeaderTitle>{user?.username}</HeaderTitle>
            </HeaderContainer>
            <Spacer top={20}/>
            <MainContainer>
                <AlbumTouchable onPress={() => pickImage()}>
                    {profilePicture ? (
                        <ProfilePicture source={{ uri: `${BASE}${profilePicture}` }} />
                    ) : (
                        <ProfilePicture source={require("../../../assets/doodle-girl-listening-music-with-headset-Graphics-78469635-1.jpg")} />
                    )}
                </AlbumTouchable>
            </MainContainer>
            <Spacer top={40}/>
            <ButtonContainer>
                {[1, 2, 3, 4, 5, 6].map((buttonID) => (
                    <ButtonTouchable
                        key={buttonID}
                        onPress={() => handleButtonPress(buttonID)}
                        onLongPress={() => handleLongPress(buttonID, albums[buttonID - 1].reviewID)}
                        delayLongPress={1500}
                    >
                        {albums[buttonID - 1] ? (
                            <AlbumImage source={{ uri: albums[buttonID - 1].albumCover }} />
                        ) : (
                            <Ionicons name="add-circle-outline" size={24} color={Colors.alb} />
                        )}
                    </ButtonTouchable>
                ))}
            </ButtonContainer>
            <Spacer top={20}/>
            <SearchChangeButtonContainer>
                <SearchChangeButton
                    pressed={true}
                    onPress={() => onListenedToList()}>
                    <StyledButtonText>
                        Listened To
                    </StyledButtonText>
                </SearchChangeButton>
                <SearchChangeButton
                    pressed={true}
                    onPress={() => onWantToListenToList()}>
                    <StyledButtonText>
                        Future Listens
                    </StyledButtonText>
                </SearchChangeButton>
            </SearchChangeButtonContainer>
            <Spacer top={20}/>
            <SearchChangeButtonContainer>
                <SearchChangeButton
                    pressed={true}
                    onPress={() => onFollowing()}>
                    <StyledButtonText>
                        Following
                    </StyledButtonText>
                </SearchChangeButton>
                <SearchChangeButton
                    pressed={true}
                    onPress={() => onFollowers()}>
                    <StyledButtonText>
                        Followers
                    </StyledButtonText>
                </SearchChangeButton>
            </SearchChangeButtonContainer>
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

export default ProfilePage;