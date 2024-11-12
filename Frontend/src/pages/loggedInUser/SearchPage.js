import React, { useEffect, useState, useCallback } from 'react';
import {
    StatusBar,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import {
    MainName, NameContainer,
    ResultButton, ResultImage, ResultText,
    SearchBackground,
    SearchBar,
    SearchChangeButton, SearchChangeButton33,
    SearchChangeButtonContainer, SmallerMainName, SmallerSecondayName, Spacer,
    StyledButtonText,
    StyledInputLabel
} from '../../components/Styles';

import { searchAlbums, searchArtists, searchUsers } from "../../SpotifyAPI"; // Add searchUsers

import { Colors } from "../../components/Styles";
import { GET_USERS } from "../../api/User";
import {useAuth} from "../../hooks/AuthProvider";
import {BASE} from "../../api/Index";

const SearchPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState(0); // 1 for artists, 0 for albums, 2 for people
    const [shouldShowKeyboard, setShouldShowKeyboard] = useState(false);
    const myUser = useAuth();
    const [profilePictures, setProfilePictures] = useState([]);

    const navigation = useNavigation();

    const handleSearch = useCallback(
        debounce(async (query) => {
            if (query.trim() === '') {
                setData(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const results = searchType === 1
                    ? await searchArtists(query)
                    : searchType === 0
                        ? await searchAlbums(query)
                        : await GET_USERS({ username: { $startsWithi: query }, id: { $ne: myUser?.user.id} }); // Fetch users if searchType is 2
                setData(results);
            } catch (error) {
                setError('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 500),
        [searchType]
    );

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
            if (data && data.length > 0 && searchType === 2) {
                const promises = data.map(user => fetchProfilePicture(user.id));
                const profilePictureUrls = await Promise.all(promises);
                setProfilePictures(profilePictureUrls);
            }
        };
        fetchData();
    }, [data, searchType, fetchProfilePicture]);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, handleSearch]);

    const handlePress = (item) => {
        setShouldShowKeyboard(true);
        if (searchType === 1) {
            navigation.navigate('ArtistPage', { artistID: item.id });
        } else if (searchType === 0) {
            navigation.navigate('AlbumPage', { albumID: item.id });
        } else {
            // Transform user data to the required format and navigate to FriendsProfile
            const user = {
                data: {
                    attributes: item,
                    id: item.id
                }
            };
            navigation.navigate('FriendsProfile', { user: user });
        }
    };

    const handleTouch = () => {
        if (searchQuery.trim() === '') {
            Keyboard.dismiss();
        }
    };

    const changeSearchType = (newType) => {
        setSearchType(newType);
    }

    return (
        <TouchableWithoutFeedback onPress={handleTouch}>
            <SearchBackground>
                <StatusBar backgroundColor={Colors.accent} />
                <SearchBar
                    placeholder={`Search for ${searchType === 1 ? 'an artist' : searchType === 0 ? 'an album' : 'a user'}`}
                    placeholderTextColor={Colors.alb}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setShouldShowKeyboard(true)}
                />
                <Spacer top = {12}/>
                <SearchChangeButtonContainer>
                    <SearchChangeButton33
                        onPress={() => changeSearchType(0)}
                        pressed={searchType === 0 ? 1 : 0}
                    >
                        <StyledButtonText>
                            Albums
                        </StyledButtonText>
                    </SearchChangeButton33>
                    <SearchChangeButton33
                        onPress={() => changeSearchType(1)}
                        pressed={searchType === 1 ? 1 : 0}>
                        <StyledButtonText>
                            Artists
                        </StyledButtonText>
                    </SearchChangeButton33>
                    <SearchChangeButton33
                        onPress={() => changeSearchType(2)} // Update to searchType 2 for People
                        pressed={searchType === 2 ? 1 : 0}>
                        <StyledButtonText>
                            People
                        </StyledButtonText>
                    </SearchChangeButton33>
                </SearchChangeButtonContainer>
                <Spacer top = {12}/>
                {
                    loading ? (
                        <ActivityIndicator size="large" color="#ffffff" />
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : data && data.length > 0 ? (
                        <ScrollView
                            keyboardShouldPersistTaps="always"
                            keyboardDismissMode="on-drag"
                        >
                            {searchType === 2 ? (
                                data.map((user, index) => (
                                    <ResultButton
                                        key={index}
                                        label={user.username || ''}
                                        onPress={() => handlePress(user)}
                                    >
                                        <ResultImage
                                            source={profilePictures[index] ? { uri: `${BASE}${profilePictures[index]}` } : require("../../../assets/doodle-girl-listening-music-with-headset-Graphics-78469635-1.jpg")}
                                        />
                                        <Spacer left={20}/>
                                        <SmallerMainName>{user.username || ''}</SmallerMainName>
                                    </ResultButton>
                                ))
                            ) : searchType === 1 ? (
                                data
                                    .filter(
                                        (item) =>
                                            item.images && Array.isArray(item.images) && item.images.length > 0
                                    )
                                    .map((item, index) => (
                                        <ResultButton
                                            key={index}
                                            label={item.name || ''}
                                            onPress={() => handlePress(item)}
                                        >
                                            {item.images && item.images.length > 0 && (
                                                <ResultImage
                                                    source={{ uri: item.images[0]?.url }}
                                                />
                                            )}
                                            <Spacer left={20}/>
                                            <SmallerMainName>{item.name || ''}</SmallerMainName>
                                        </ResultButton>
                                    ))
                            ) : (
                                data
                                    .filter(
                                        (item) =>
                                            item.images && Array.isArray(item.images) && item.images.length > 0
                                    )
                                    .reduce((acc, item) => {
                                        if (!acc.some((album) => album.name === item.name)) {
                                            acc.push(item);
                                        }
                                        return acc;
                                    }, [])
                                    .map((item, index) => (
                                        <ResultButton
                                            key={index}
                                            label={item.name || ''}
                                            onPress={() => handlePress(item)}
                                        >
                                            {item.images && item.images.length > 0 && (
                                                <ResultImage
                                                    source={{ uri: item.images[0]?.url }}
                                                />
                                            )}
                                            <Spacer left={20}/>
                                            <NameContainer>
                                            <SmallerMainName>
                                                {item.name || ''}
                                            </SmallerMainName>
                                            <SmallerSecondayName>
                                                {item.artists && item.artists.length > 0
                                                ? item.artists[0]?.name || ''
                                                : ''}
                                            </SmallerSecondayName>
                                            </NameContainer>
                                        </ResultButton>
                                    ))
                            )}
                        </ScrollView>
                    ) : null}
            </SearchBackground>
        </TouchableWithoutFeedback>
    );
};

export default SearchPage;
