import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import {
    BackButton,
    Colors, HeaderContainer, HeaderTitle,
    SearchChangeButton,
    SearchChangeButtonContainer, SortButton,
    SortFullButton, Spacer,
    StyledBackground,
    StyledButtonText,
} from '../../components/Styles';
import {Ionicons} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";

const SortPage = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { sortParameter } = route.params ?? {}; // Destructure sortParameter from route.params
    const{ pageID } = route.params ?? {};
    const selectFavoriteMode = route.params?.selectFavoriteMode;
    const buttonID = route.params?.buttonID
    const selectListAlbum = route.params?.selectListAlbum
    const listID = route.params?.listID

    const [sortOrder, setSortOrder] = useState('desc');
    const [sortField, setSortField] = useState('id');

    useEffect(() => {
        if (sortParameter) {
            const [field, order] = sortParameter.split(':'); // Split sortParameter into field and order
            setSortField(field);
            setSortOrder(order);
        }
    }, [sortParameter]);

    const handleSortOrderPress = (order) => {
        setSortOrder(order);
    };

    const handleSortFieldPress = (field) => {
        setSortField(field);
    };

    const getSortParameter = () => {
        return `${sortField}:${sortOrder}`;
    };

    const handleSortPress = () => {
        const newSortParameter = getSortParameter();
        if(pageID === 1) {
            navigation.navigate('ListenedToList', {sortParameter: newSortParameter, selectFavoriteMode: selectFavoriteMode, buttonID: buttonID,
                selectListAlbum: selectListAlbum, listID: listID});
        }
        else if(pageID === 2) {
            navigation.navigate('WantToListenToList', {sortParameter: newSortParameter});
        }
    };

    return (
        <StyledBackground>
            <HeaderContainer>
                <SortButton onPress={handleSortPress}>
                    <Ionicons name="checkmark-outline" size={30} color={Colors.alb}/>
                </SortButton>
                <BackButton onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                </BackButton>
                <HeaderTitle>Sort By</HeaderTitle>
            </HeaderContainer>
            <Spacer top={12}/>
            <StatusBar backgroundColor={Colors.accent} />
            <SearchChangeButtonContainer>
                <SearchChangeButton
                    onPress={() => handleSortOrderPress('desc')}
                    pressed={sortOrder === 'desc'}
                >
                    <StyledButtonText>Descending</StyledButtonText>
                </SearchChangeButton>
                <SearchChangeButton
                    onPress={() => handleSortOrderPress('asc')}
                    pressed={sortOrder === 'asc'}
                >
                    <StyledButtonText>Ascending</StyledButtonText>
                </SearchChangeButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    onPress={() => handleSortFieldPress('nota')}
                    pressed={sortField === 'nota'}
                >
                    <StyledButtonText>Rating</StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    onPress={() => handleSortFieldPress('albumTitle')}
                    pressed={sortField === 'albumTitle'}
                >
                    <StyledButtonText>Title</StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    onPress={() => handleSortFieldPress('artistName')}
                    pressed={sortField === 'artistName'}
                >
                    <StyledButtonText>Artist</StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    onPress={() => handleSortFieldPress('releaseDate')}
                    pressed={sortField === 'releaseDate'}
                >
                    <StyledButtonText>Release date</StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
            <Spacer top={12}/>
            <SearchChangeButtonContainer>
                <SortFullButton
                    onPress={() => handleSortFieldPress('id')}
                    pressed={sortField === 'id'}
                >
                    <StyledButtonText>Add date</StyledButtonText>
                </SortFullButton>
            </SearchChangeButtonContainer>
        </StyledBackground>
    );
};

export default SortPage;
