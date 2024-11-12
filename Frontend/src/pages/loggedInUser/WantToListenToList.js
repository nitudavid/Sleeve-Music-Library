import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, FlatList, TouchableOpacity, View, Dimensions, BackHandler } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import {
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle, NameContainer, ResultButton, ResultImage,
    SearchChangeButton, SearchChangeButtonContainer, SmallerMainName, SmallerSecondayName,
    SortButton, Spacer,
    StyledBackground, StyledButtonText
} from "../../components/Styles";
import { useAuth } from "../../hooks/AuthProvider";
import { GET_USER_ALBUM_REVIEW } from "../../api/User";
import {Ionicons} from "@expo/vector-icons";
import sortPage from "./SortPage";

const WantToListenToList = () => {
    const { user } = useAuth();
    const userID = user?.id;
    const [albums, setAlbums] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const route = useRoute();
    const sortParameter = route.params?.sortParameter || 'id:desc'; // Default sort parameter
    const pageID = 2

    const [viewMode, setViewMode] = useState('grid'); // Initial view mode
    const [key, setKey] = useState('grid'); // Key to force re-render

    const fetchAlbums = useCallback(async () => {
        try {
            const albumReviews = await GET_USER_ALBUM_REVIEW(userID, { wantToListenTo: 1 }, [ sortParameter ]);
            const albumDetails = albumReviews.data.map(albumReview => ({
                reviewID: albumReview.id,
                albumID: albumReview.attributes.albumID,
                albumTitle: albumReview.attributes.albumTitle,
                albumCover: albumReview.attributes.albumCover,
                albumArtist: albumReview.attributes.artistName,
            }));
            setAlbums(albumDetails);
        } catch (error) {
            console.error('Error fetching albums:', error);
        }
    }, [userID, sortParameter]);

    useEffect(() => {
        fetchAlbums();
    }, [userID, sortParameter, fetchAlbums]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch albums again when the screen gains focus
            fetchAlbums();
        });

        return unsubscribe;
    }, [navigation, fetchAlbums]);

    const handlePress = (albumID) => {
        navigation.navigate('AlbumPage', { albumID });
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setKey(mode); // Change key to force re-render
    };

    const renderGridAlbum = ({ item }) => (
        <AlbumTouchable onPress={() => handlePress(item.albumID)}>
            <AlbumImage source={{ uri: item.albumCover }} />
        </AlbumTouchable>
    );

    const renderListAlbum = ({ item }) => (
        <ResultButton onPress={() => handlePress(item.reviewID, item.albumID)}>
            <AlbumListContainer>
                <ResultImage source={{ uri: item.albumCover }} />
                <Spacer left={20}/>
                <NameContainer>
                    <SmallerMainName>
                        {item.albumTitle || ''}
                    </SmallerMainName>
                    <SmallerSecondayName>
                        {item.albumArtist || ''}
                    </SmallerSecondayName>
                </NameContainer>
            </AlbumListContainer>
        </ResultButton>
    );

    const handleSortPress = () => {
        navigation.navigate('SortPage', { sortParameter: sortParameter, pageID: pageID }); // Navigate to the SortPage
    };

    return (
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent} />
            <HeaderContainer>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <SortButton onPress={handleSortPress}>
                    <Ionicons name="options-outline" size={30} color={Colors.alb} />
                </SortButton>
                <HeaderTitle>Future Listens</HeaderTitle>
            </HeaderContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SearchChangeButton
                    pressed={viewMode === 'grid'}
                    onPress={() => handleViewModeChange('grid')}
                >
                    <StyledButtonText>Grid</StyledButtonText>
                </SearchChangeButton>
                <SearchChangeButton
                    pressed={viewMode === 'list'}
                    onPress={() => handleViewModeChange('list')}
                >
                    <StyledButtonText>List</StyledButtonText>
                </SearchChangeButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            {viewMode === 'grid' ? (
                <FlatList
                    data={albums}
                    renderItem={renderGridAlbum}
                    keyExtractor={(item) => item.reviewID}
                    numColumns={3}
                    key={key} // Key to force re-render
                />
            ) : (
                <FlatList
                    data={albums}
                    renderItem={renderListAlbum}
                    keyExtractor={(item) => item.reviewID}
                    key={key} // Key to force re-render
                />
            )}
        </StyledBackground>
    );
};

// Get the screen width
const screenWidth = Dimensions.get('window').width;

// Calculate the width and height for the image
const imageWidth = (screenWidth / 3) - 6;
const imageHeight = (screenWidth / 3) - 6;

const AlbumTouchable = styled(TouchableOpacity)`
    padding: 3px;
`;

const AlbumImage = styled.Image`
    width: ${imageWidth}px;
    height: ${imageHeight}px;
`;

const AlbumListContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

const AlbumTitle = styled.Text`
    color: ${Colors.alb};
    font-size: 16px;
    margin-left: 10px;
`;

export default WantToListenToList;
