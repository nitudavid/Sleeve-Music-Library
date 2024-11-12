import styled from "styled-components";
import {
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Image,
    ImageBackground,
    PanResponder,
    Dimensions, ActivityIndicator
} from "react-native";
import Constants from "expo-constants";
import {
    AlbumImage, AlbumTouchable,
    Colors, ErrorText, HeaderContainer, HeaderTitle, MainName,
    SearchChangeButton,
    SearchChangeButtonContainer, SmallerMainName, SmallerSecondayName, SortButton, SortFullButton, Spacer,
    StyledBackground,
    StyledButtonText
} from "../../components/Styles";
import React, { useEffect, useState } from "react";
import { CustomButton } from "../../components/CustomButton";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/AuthProvider";
import { GET_LISTS } from "../../api/User";
import { Ionicons } from "@expo/vector-icons";

const HomePage = () => {

    const navigation = useNavigation();
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMyLists, setShowMyLists] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const filters = showMyLists ? { user: user?.id } : { user: { $notIn: [user?.id] } };
            const { data } = await GET_LISTS(filters);
            setLists(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError("Error fetching lists");
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [showMyLists, user])
    );

    const handleCreateList = () => {
        navigation.navigate('CreateList', { existingListID: null });
    }

    const handleListPress = (listID) => {
        if (showMyLists) {
            navigation.navigate('CreateList', { existingListID: listID });
        }
    }

    const handleUserPressed = (user) => {
        if (!showMyLists) {
            navigation.navigate('FriendsProfile', { user: user });
        }
    };

    // const panResponder = React.useRef(
    //     PanResponder.create({
    //         onStartShouldSetPanResponder: () => true,
    //         onPanResponderGrant: () => {
    //             // Handle the start of the swipe gesture
    //         },
    //         onPanResponderMove: (evt, gestureState) => {
    //             // Handle the swipe gesture movement
    //             const { dx } = gestureState;
    //             if (dx > 50) {
    //                 // Swipe right, toggle to "Discover Lists"
    //                 handleDiscoverLists();
    //             } else if (dx < -50) {
    //                 // Swipe left, toggle to "My Lists"
    //                 handleMyLists();
    //             }
    //         },
    //         onPanResponderRelease: () => {
    //             // Handle the end of the swipe gesture
    //         },
    //     })
    // ).current;

    const renderList = ({ item }) => (
        <ListContainer onPress={() => handleListPress(item.id)}>
            <SmallerMainName>{item.attributes.listName}</SmallerMainName>
            <UserTouchable onPress={() => handleUserPressed(item.attributes.user)}>
                <SmallerSecondayName>by {item.attributes.username}</SmallerSecondayName>
            </UserTouchable>
            {showMyLists &&
                <SortButton>
                    <Ionicons name="caret-forward-outline" size={24} color={Colors.alb} />
                </SortButton>}
            <FlatList
                horizontal
                data={item.attributes.userAlbums.data}
                renderItem={renderAlbum}
                keyExtractor={(album) => album.attributes.albumID.toString()}
            />
        </ListContainer>
    );

    const renderAlbum = ({ item }) => (
        <AlbumTouchable onPress={() => handleAlbumPress(item.attributes.albumID)}>
            <AlbumImage source={{ uri: item.attributes.albumCover }} />
        </AlbumTouchable>
    );

    const handleAlbumPress = (albumID) => {
        navigation.navigate('AlbumPage', { albumID });
    }

    const handleDiscoverLists = () => {
        setShowMyLists(false);
    }

    const handleMyLists = () => {
        setShowMyLists(true);
    }

    return (
        <StyledBackground>
            <StatusBar backgroundColor={Colors.accent} />
            <HeaderContainer>
                <HeaderTitle>Welcome back, {user?.prenume}</HeaderTitle>
            </HeaderContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SearchChangeButton
                    onPress={handleDiscoverLists}
                    pressed={!showMyLists}>
                    <StyledButtonText>Discover Lists</StyledButtonText>
                </SearchChangeButton>
                <SearchChangeButton
                    onPress={handleMyLists}
                    pressed={showMyLists}>
                    <StyledButtonText>My Lists</StyledButtonText>
                </SearchChangeButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    pressed={false}
                    onPress={() => handleCreateList()}>
                    <StyledButtonText>
                        New List
                    </StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            {loading ? (
                <ActivityIndicator/>
            ) : error ? (
                <ErrorText>{error}</ErrorText>
            ) : (
                <FlatList
                    data={lists}
                    renderItem={renderList}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </StyledBackground>
    );
}

const ListContainer = styled(TouchableOpacity)`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: ${Colors.accent};
`;

const UserTouchable = styled(TouchableOpacity)`
    padding: 3px;
`;

export default HomePage;
