import React, { useState, useEffect } from 'react';
import {StatusBar, Alert, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BlurView} from "expo-blur";
import {
    BackButton,
    Colors, ErrorText, HeaderContainer, HeaderTitle, MainContainer, MainImage, MainName,
    SearchChangeButton,
    SearchChangeButtonContainer, SortButton, Spacer,
    StyledBackground,
    StyledButtonText
} from '../../components/Styles';
import { ADD_ALBUM_REVIEW, GET_USER_ALBUM_REVIEW, UPDATE_ALBUM } from "../../api/User";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { useAuth } from "../../hooks/AuthProvider";
import { getAlbumDetails } from "../../SpotifyAPI";
import styled from 'styled-components/native';
import DiscRating from "../../components/DiscRating";
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";


const AlbumPage = () => {
    const route = useRoute();
    const { albumID } = route.params;
    const { user } = useAuth();
    const navigation = useNavigation();

    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState('');
    const [existingReviewId, setExistingReviewId] = useState(null);
    const [listenedTo, setListenedTo] = useState(false);
    const [wantToListenTo, setWantToListenTo] = useState(false);


    useEffect(() => {
        const fetchReview = async () => {
            try {
                if (user) {
                    const data = {
                        albumID: albumID
                    }
                    const existingReview = await GET_USER_ALBUM_REVIEW(user.id, data);
                    if (existingReview && existingReview.data.length > 0) {
                        const userReview = existingReview.data[0].attributes;
                        if (userReview.nota) {
                            setRating(userReview.nota.toString());
                        }
                        setExistingReviewId(existingReview.data[0].id);
                        setListenedTo(userReview.listenedTo);
                        setWantToListenTo(userReview.wantToListenTo);
                    }
                }
            } catch (error) {
                console.error('Error fetching existing review:', error);
            }
        };

        fetchReview();
    }, [user, albumID]);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const albumData = await getAlbumDetails(albumID);
                setAlbum(albumData);
            } catch (error) {
                console.error('Error fetching album details:', error);
                Alert.alert('Error', 'Failed to fetch album details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [albumID]);

    const handleListenedTo = async () => {
        try {
            if (user) {
                const data = {
                    nota: null,
                    listenedTo: !listenedTo,
                    wantToListenTo: false
                }
                if (existingReviewId) {
                    await UPDATE_ALBUM(existingReviewId, data);
                    setRating('');
                    setWantToListenTo(false);
                } else {
                    const newData = {
                        userID: user.id,
                        albumID: albumID,
                        albumTitle: album.name,
                        albumCover: album.images[0]?.url,
                        artistID: album.artists[0]?.id,
                        artistName: album.artists[0]?.name,
                        releaseDate: album.release_date,
                        ...data
                    }
                    const response = await ADD_ALBUM_REVIEW(newData);
                    setExistingReviewId(response.data.id)
                }
                setListenedTo(prevState => !prevState);
                setWantToListenTo(false);
                setRating(data.nota === null ? '' : data.nota);
            }
        } catch (error) {
            console.error('Error updating review:', error);
            Alert.alert('Error', 'Failed to update review.');
        }
    };

    const handleWantToListenTo = async () => {
        try {
            if (user) {
                const data = {
                    nota: null,
                    listenedTo: false,
                    wantToListenTo: !wantToListenTo
                }
                if (existingReviewId) {
                    await UPDATE_ALBUM(existingReviewId, data);
                    setRating('');
                    setListenedTo(false);
                } else {
                    const newData = {
                        userID: user.id,
                        albumID: albumID,
                        albumTitle: album.name,
                        albumCover: album.images[0]?.url,
                        artistID: album.artists[0]?.id,
                        artistName: album.artists[0]?.name,
                        releaseDate: album.release_date,
                        ...data
                    }
                    const response = await ADD_ALBUM_REVIEW(newData);
                    setExistingReviewId(response.data.id)
                }
                setListenedTo(false);
                setWantToListenTo(prevState => !prevState);
            }
        } catch (error) {
            console.error('Error updating review:', error);
            Alert.alert('Error', 'Failed to update review.');
        }
    };

    const handleAddRating = async (newRating) => {
        try {
            if (user && newRating) { // Check if newRating is truthy
                if (existingReviewId) {
                    const data = {
                        nota: newRating.toString(), // Convert newRating to a string
                        listenedTo: true,
                        wantToListenTo: false
                    };
                    await UPDATE_ALBUM(existingReviewId, data);
                    setListenedTo(true);
                    setWantToListenTo(false);
                } else {
                    const data = {
                        userID: user.id,
                        albumID: albumID,
                        albumTitle: album.name,
                        nota: newRating.toString(), // Convert newRating to a string
                        albumCover: album.images[0]?.url,
                        artistID: album.artists[0]?.id,
                        artistName: album.artists[0]?.name,
                        releaseDate: album.release_date,
                        listenedTo: true,
                        wantToListenTo: false
                    };
                    const response = await ADD_ALBUM_REVIEW(data);
                    setExistingReviewId(response.data.id);
                    setListenedTo(true);
                    setWantToListenTo(false);
                }
            }
        } catch (error) {
            console.error('Error posting review:', error);
            Alert.alert('Error', 'Failed to post review.');
        }
    };

    if (loading) {
        return (
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <ActivityIndicator size="large" color="#ffffff" />
            </StyledBackground>
        );
    }

    if (!album) {
        return (
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <ErrorText>Album not found</ErrorText>
            </StyledBackground>
        );
    }

    const handleMoveToArist = (albumID) => {
        navigation.navigate('ArtistPage', { artistID: album.artists[0].id });
    };

    console.log(rating)

    return (
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent} />
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>{album.name}</HeaderTitle>
            </HeaderContainer>
            <MainContainer>
                <BlurView
                    intensity={100}
                    tint="default"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '120%', // Adjust the height as needed
                        overflow: 'hidden',
                    }}
                >
                    <MainImage
                        source={{ uri: album.images[0]?.url }}
                        style={{ width: '100%', height: '100%' }}
                        blurRadius={70}
                    />
                </BlurView>
                {/* Add a LinearGradient to create the fading effect */}
                <LinearGradient
                    colors={['transparent', Colors.fundal]} // Adjust the end color as needed
                    style={{
                        position: 'absolute',
                        top: '30%', // Start the gradient fade from 60% of the height
                        left: 0,
                        right: 0,
                        height: '90%', // Gradient should cover the remaining 40% height
                    }}
                />
                <Spacer top={20}/>
                <MainImage source={{ uri: album.images[0]?.url }} />
                <Spacer top={10}/>
                {/*<MainName>{album.name}</MainName>*/}
                <RedirectToArtistPageLink onPress={handleMoveToArist}>
                    <MainName>
                        by {album.artists[0].name}
                    </MainName>
                </RedirectToArtistPageLink>
                <Spacer top={30}/>
                <SearchChangeButtonContainer>
                    <SearchChangeButton
                        pressed={listenedTo ? 1 : 0}
                        onPress={handleListenedTo}>
                        <StyledButtonText>
                            Listened To
                        </StyledButtonText>
                    </SearchChangeButton>
                    <SearchChangeButton
                        pressed={wantToListenTo ? 1 : 0}
                        onPress={handleWantToListenTo}>
                        <StyledButtonText>
                            Future Listen
                        </StyledButtonText>
                    </SearchChangeButton>
                </SearchChangeButtonContainer>
                <Spacer top={20}/>
                <DiscRating
                    rating={parseInt(rating)} // Ensure rating is passed as a number
                    setRating={setRating}
                    handleAddRating={handleAddRating}
                />
            </MainContainer>
        </StyledBackground>
    );
};

export default AlbumPage;

 const RedirectToArtistPage = styled(Text)`
    color: ${Colors.alb};
    font-size: 15px;
`
 const RedirectToArtistPageLink = styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
`