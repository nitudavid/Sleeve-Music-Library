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
import {GET_LISTS, GET_USER_ALBUM_REVIEW, UPDATE_ALBUM, UPDATE_LIST} from "../../api/User";
import {Ionicons} from "@expo/vector-icons";
import sortPage from "./SortPage";

const ListenedToList = () => {
    const { user } = useAuth();
    const userID = user?.id;
    const [albums, setAlbums] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const route = useRoute();
    const sortParameter = route.params?.sortParameter || 'id:desc'; // Default sort parameter
    const pageID = 1
    const selectFavoriteMode = route.params?.selectFavoriteMode || 0;
    const buttonID = route.params?.buttonID
    const selectListAlbum = route.params?.selectListAlbum || 0
    const listID = route.params?.listID


    const [viewMode, setViewMode] = useState('grid'); // Initial view mode
    const [key, setKey] = useState('grid'); // Key to force re-render

    const fetchAlbums = useCallback(async () => {
        try {
            const albumReviews = await GET_USER_ALBUM_REVIEW(userID, { listenedTo: 1 }, [ sortParameter ]);
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

    const handlePress = async (reviewID, albumID) => {
        if (selectFavoriteMode === 1) {
            try {
                // Update the favorite field of the album using reviewID
                await UPDATE_ALBUM(reviewID, { favorite: buttonID });
                // Navigate back to the previous screen
                navigation.goBack();
            } catch (error) {
                console.error('Error updating album favorite:', error);
            }
        } else if (selectListAlbum === 1 && listID) {
            try {
                // Fetch the current list
                const list = await GET_LISTS({ id: listID });
                const userAlbums = list.data[0]?.attributes?.userAlbums?.data || [];
                const reviewIDs = userAlbums.map(album => album.id);

                // Add the new reviewID to the list
                if (!reviewIDs.includes(reviewID)) {
                    reviewIDs.push(reviewID);
                    // Update the list with the new set of reviewIDs
                    await UPDATE_LIST(listID, { userAlbums: reviewIDs });
                }

                // Navigate back to the AddListAlbums screen
                navigation.navigate('AddListAlbums', { listID: listID });
            } catch (error) {
                console.error('Error updating list albums:', error);
            }
        } else {
            // Navigate to AlbumPage using albumID
            navigation.navigate('AlbumPage', { albumID });
        }
    };


    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setKey(mode); // Change key to force re-render
    };

    const renderGridAlbum = ({ item }) => (
        <AlbumTouchable onPress={() => handlePress(item.reviewID, item.albumID)}>
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
        navigation.navigate('SortPage', { sortParameter: sortParameter, pageID: pageID, selectFavoriteMode: selectFavoriteMode, buttonID: buttonID,
            selectListAlbum: selectListAlbum, listID: listID}); // Navigate to the SortPage
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
                <HeaderTitle>Listened To List</HeaderTitle>
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

export default ListenedToList;
