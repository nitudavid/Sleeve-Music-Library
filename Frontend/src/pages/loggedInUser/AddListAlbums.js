import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StatusBar, TouchableOpacity, View, Alert } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { GET_LISTS, UPDATE_LIST } from "../../api/User";
import {
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle,
    SortButton,
    StyledBackground
} from "../../components/Styles";

const AddListAlbums = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const listID = route.params?.listID;
    const [listName, setListName] = useState('');
    const [albums, setAlbums] = useState([]);

    const fetchExistingList = useCallback(async () => {
        try {
            const list = await GET_LISTS({ id: listID });
            setListName(list.data[0].attributes.listName);
            const userAlbums = list.data[0]?.attributes?.userAlbums?.data || []; // Ensure userAlbums.data is used correctly
            const parsedAlbums = userAlbums.map(album => ({
                albumID: album.attributes.albumID,
                albumCover: album.attributes.albumCover,
                reviewID: album.id
            }));
            // Add a placeholder for the button
            setAlbums([...parsedAlbums, { isButton: true }]);
        } catch (error) {
            console.error('Error fetching existing list:', error);
        }
    }, [listID]);

    useEffect(() => {
        fetchExistingList();
    }, [listID, fetchExistingList]);

    useFocusEffect(
        useCallback(() => {
            fetchExistingList();
        }, [fetchExistingList])
    );

    const handlePress = (reviewID, albumID) => {
        navigation.navigate('AlbumPage', { albumID });
    };

    const handleLongPress = async (reviewID) => {
        try {
            // Remove the reviewID from the list of user albums
            const updatedAlbums = albums.filter(album => album.reviewID !== reviewID);
            setAlbums(updatedAlbums);
            const albumIDs = updatedAlbums.filter(album => !album.isButton).map(album => album.reviewID);
            await UPDATE_LIST(listID, { userAlbums: albumIDs });
            fetchExistingList(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    const renderGridItem = ({ item }) => {
        if (item.isButton) {
            return (
                <ButtonTouchable onPress={() => navigation.navigate('ListenedToList', { selectListAlbum: 1, listID: listID })}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.alb} />
                </ButtonTouchable>
            );
        }
        return (
            <AlbumTouchable
                onPress={() => handlePress(item.reviewID, item.albumID)}
                onLongPress={() => handleLongPress(item.reviewID)}
                delayLongPress={1500}
            >
                <AlbumImage source={{ uri: item.albumCover }} />
            </AlbumTouchable>
        );
    };

    return (
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent} />
            <HeaderContainer>
                <SortButton onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="checkmark-outline" size={30} color={Colors.alb} />
                </SortButton>
                <BackButton onPress={() => navigation.navigate('CreateList', { existingListID: listID })}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>{listName}</HeaderTitle>
            </HeaderContainer>
            <FlatList
                data={albums}
                renderItem={renderGridItem}
                numColumns={3}
                legacyItemSpacing={false}
                keyExtractor={(item) => item.albumID || 'button'}
            />
        </StyledBackground>
    );
};

const screenWidth = Dimensions.get('window').width;

// Calculate the width and height for the image
const imageWidth = (screenWidth / 3) - 6;
const imageHeight = (screenWidth / 3) - 6;

const AlbumTouchable = styled(TouchableOpacity)`
    padding: 3px;
`;

const AlbumImage = styled(Image)`
    width: ${imageWidth}px;
    height: ${imageHeight}px;
`;

const ButtonTouchable = styled(TouchableOpacity)`
    width: ${imageWidth}px;
    height: ${imageHeight}px;
    background-color: ${Colors.fundal};
    margin: 3px;
    justify-content: center;
    align-items: center;
`;

export default AddListAlbums;
