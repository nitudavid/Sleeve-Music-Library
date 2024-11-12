import styled from "styled-components";
import {
    Alert,
    Keyboard,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Constants from "expo-constants";
import {
    BackButton,
    Colors,
    HeaderContainer,
    HeaderTitle,
    SearchBar,
    SortButton, Spacer,
    StyledBackground
} from "../../components/Styles";
import React, {useState, useEffect} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "../../hooks/AuthProvider";
import {useNavigation, useRoute, useFocusEffect} from "@react-navigation/native";
import {CustomInput} from "../../components/CustomInput";
import {CREATE_LIST, UPDATE_LIST, GET_LISTS, DELETE_LIST} from "../../api/User";
import {CustomButton} from "../../components/CustomButton";

const ErrorMessage = styled.Text`
    color: red;
    margin-top: 5px;
`;

const CreateList = () => {
    const {user} = useAuth();
    const route = useRoute();
    const navigation = useNavigation();
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');
    const existingListID = route.params?.existingListID;

    const fetchExistingList = async () => {
        try {
            const list = await GET_LISTS({ id: existingListID });
            setListName(list.data[0].attributes.listName);
        } catch (error) {
            console.error('Error fetching existing list:', error);
        }
    };

    useEffect(() => {
        if (existingListID) {
            fetchExistingList();
        }
    }, [existingListID]);

    const handleCreateList = async () => {
        if (!listName) {
            setError('List Name is required');
            return;
        }

        if (existingListID) {
            try {
                // Update the existing list's name
                await UPDATE_LIST(existingListID, { listName });
                navigation.navigate('AddListAlbums', { listID: existingListID });
            } catch (error) {
                console.error('Error updating list:', error);
            }
        } else {
            try {
                // Create a new list
                const data = {
                    listName: listName,
                    user: user?.id,
                    username: user.username
                };
                const newID = await CREATE_LIST(data);
                navigation.navigate('AddListAlbums', { listID: newID.data.id });
            } catch (error) {
                console.error('Error creating list:', error);
            }
        }
    };

    // Clear error when the screen loses focus
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setError('');
            };
        }, [])
    );

    const showAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                "Confirm",
                "Are you sure you want to delete the list?",
                [
                    {
                        text: "No",
                        onPress: () => resolve(false),
                        style: "cancel"
                    },
                    { text: "Yes", onPress: () => resolve(true) }
                ]
            );
        });
    }
    const handleDeleteList = async (existingListID) => {
        try {
            const confirmed = await showAlert();
            if (confirmed) {
                await DELETE_LIST(existingListID);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <StyledBackground>
                <StatusBar backgroundColor={Colors.accent}/>
                <HeaderContainer>
                    <SortButton onPress={handleCreateList}>
                        <Ionicons name="checkmark-outline" size={30} color={Colors.alb}/>
                    </SortButton>
                    <BackButton onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={30} color={Colors.alb} />
                    </BackButton>
                    <HeaderTitle>Create List</HeaderTitle>
                </HeaderContainer>
                <Spacer top={40}/>
                <CustomInput
                    label="List Name"
                    placeholder="Name for the list..."
                    value={listName}
                    onChangeText={(text) => {
                        setListName(text);
                        setError('');
                    }}
                />
                {error ? <ErrorMessage>{error}</ErrorMessage> : null}
                <Spacer top={30}/>
                {existingListID &&
                    <CustomButton
                        label="Delete List"
                        onPress={() => handleDeleteList(existingListID)}
                    />}
            </StyledBackground>
        </TouchableWithoutFeedback>
    );
}

export default CreateList;
