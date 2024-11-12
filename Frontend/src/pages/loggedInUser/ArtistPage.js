import React, { useEffect, useState } from 'react';
import {StatusBar, Text, View, Image, ActivityIndicator, Alert, FlatList, Dimensions, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import { getArtistDetails, getArtistAlbums } from "../../SpotifyAPI";
import styled from 'styled-components/native';
import {
    AlbumImage,
    AlbumTouchable,
    ArtistName, BackButton,
    Colors, ErrorText, HeaderContainer, HeaderTitle, MainContainer, MainImage, MainName,
    SearchChangeButton,
    SearchChangeButtonContainer, SortFullButton, Spacer,
    StyledBackground,
    StyledButtonText
} from '../../components/Styles';
import Rating from "../../components/RatingSystem";
import {Ionicons} from "@expo/vector-icons";
import {BlurView} from "expo-blur";
import {LinearGradient} from "expo-linear-gradient";

const ArtistPage = () => {
    const route = useRoute();
    const { artistID } = route.params;
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [artistsAlbums, setArtistsAlbums] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistDetails = await getArtistDetails(artistID);
                setArtist(artistDetails);
                const artistAlbums = await getArtistAlbums(artistID);
                setAlbums(artistAlbums);
            } catch (error) {
                console.error('Error fetching artist data:', error);
                Alert.alert('Error', 'Failed to fetch artist data.');
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [artistID]);

    const handlePress = (albumID) => {
        navigation.navigate('AlbumPage', { albumID });
    };
    const renderAlbum = ({ item }) => (
        <AlbumTouchable onPress={() => handlePress(item.id)}>
            <AlbumImage source={{ uri: item.images[0]?.url }} />
        </AlbumTouchable>
    );

    if (loading) {
        return (
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <ActivityIndicator size="large" color="#ffffff" />
            </StyledBackground>
        );
    }

    if (!artist) {
        return (
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <ErrorText>Artist not found</ErrorText>
            </StyledBackground>
        );
    }

    return (
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent} />
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>{artist.name}</HeaderTitle>
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
                        height: '100%', // Adjust the height as needed
                        overflow: 'hidden',
                    }}
                >
                    <MainImage
                        source={{ uri: artist.images[0]?.url }}
                        style={{ width: '100%', height: '100%' }}
                        blurRadius={70}
                    />
                </BlurView>
                {/* Add a LinearGradient to create the fading effect */}
                <LinearGradient
                    colors={['transparent', Colors.fundal]} // Adjust the end color as needed
                    style={{
                        position: 'absolute',
                        top: '40%', // Start the gradient fade from 60% of the height
                        left: 0,
                        right: 0,
                        height: '60%', // Gradient should cover the remaining 40% height
                    }}
                />
                <Spacer top={20}/>
                <MainImage source={{ uri: artist.images[0]?.url }} />
                <Spacer top={10}/>
            </MainContainer>
            <SearchChangeButtonContainer>
                <SortFullButton
                    pressed = {artistsAlbums}>
                    <StyledButtonText>
                        Artist's Albums
                    </StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={20}/>
            <FlatList
                data={albums}
                renderItem={renderAlbum}
                keyExtractor={(item) => item.id}
                numColumns={3}
            />
        </StyledBackground>
    );
};
export default ArtistPage;
