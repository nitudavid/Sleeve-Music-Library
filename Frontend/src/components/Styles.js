import styled from "styled-components";
import {Dimensions, Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;
export const Colors = {
    fundal: "#150d08",
    accent: "#0a0604",
    third: "#331a14",
    aprins: "#922a06",
    alb: "aliceblue",
    albastru: "#1533b2",
    rosu: "red",
    gri:"#696969"

};

const{fundal, accent, third,alb, albastru, aprins, rosu, gri} = Colors;
export const StyledBackground = styled(View)`
    flex: 1;
    background: ${fundal};
`

export const SearchBackground = styled(View)`
    flex: 1;
    background: ${fundal};
`

export const StyledTextInput = styled(TextInput)`
    background-color: ${third};
    padding-left: 25px;
    padding-right: 55px;
    border-radius: 30px;
    font-size: 16px;
    height: 60px;
    margin-left: 20px;
    margin-right: 20px;
    color: ${alb};
    border-width: 2px;
    border-color: ${accent};
`

export const StyledInputLabel = styled(Text)`
    margin-left: 35px;
    color: ${alb};
    font-size: 14px;
    text-align: left;
`

export const StyledButton = styled(TouchableOpacity)`
    padding: 15px;  
    background-color: ${aprins};
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    margin-left: 20px;
    margin-right: 20px;
    height: 60px;
`

export const StyledShowPass = styled(TouchableOpacity)`
    right: 45px;
    top: 35px;
    position: absolute;
    z-index: 1;
`

export const RedirectTextView = styled(View)`
    justify-content: center;
    flex-direction: row;
    align-items: center;
`

export const RedirectText = styled(Text)`
    justify-content: center;
    align-content: center;
    color: ${alb};
    font-size: 15px;
`

export const RedirectTextLink = styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
`

export const RedirectTextLinkContent = styled(Text)`
    color: ${albastru};
    font-size: 15px;
`

export const SearchBar = styled(TextInput)`
    background-color: ${third};
    padding: 15px;
    padding-right: 55px;
    font-size: 16px;
    height: 60px;
    color: ${alb};
`

export const StyledButtonText =styled(Text)`
    color: ${alb};
    font-size: 16px;
`

export const SearchChangeButton33 = styled(TouchableOpacity)`
    background-color: ${({ pressed }) => (pressed ? `${aprins}` : `${third}`)};
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: 42px;
    color: ${alb};
    width: 30%;
    border-radius: 21px;
`


export const SortFullButton = styled(TouchableOpacity)`
    background-color: ${({ pressed }) => (pressed ? `${aprins}` : `${third}`)};
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: 50px;
    color: ${alb};
    width: 95%;
    border-radius: 25px;
`

export const SearchChangeButton = styled(TouchableOpacity)`
    background-color: ${({ pressed }) => (pressed ? `${aprins}` : `${third}`)};
    justify-content: center;
    align-items: center;
    font-size: 16px;
    height: 50px;
    color: ${alb};
    width: 45%;
    border-radius: 25px;
`

export const SearchChangeButtonContainer = styled(View)`
    flex-direction: row; 
    justify-content: space-around;
    align-items: center;
    width: 100%;
    position: sticky;
    z-index: 1;
    top: 0;
`;

export const ErrorText = styled(Text)`
    color: ${rosu};
    font-size: 12px;
    text-align: right;
    margin-right: 45px;
    margin-top: 5px;
    margin-bottom: 5px;
`

export const HeaderContainer = styled(View)`
    height: 60px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${third};
`;

export const Spacer = styled(View)`
  padding-top: ${props => props.top || 0}px;
  padding-left: ${props => props.left || 0}px;
`;

export const BackButton = styled(TouchableOpacity)`
    position: absolute;
    left: 15px;
    top: 15px
`;

export const SortButton = styled(TouchableOpacity)`
    position: absolute;
    right: 15px;
    top: 15px
`;

export const HeaderTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${alb};
    text-align: center;
    flex-wrap: wrap;
    max-width: 200px;
`;

export const ResultText = styled(Text)`
    color: ${alb};
    font-size: 15px;
    text-align: left;
    padding-left: 10px;
    padding-right: 30px;
    flex-direction: column;
`

export const ResultImage = styled(ImageBackground)`
    width: 90px;
    height: 90px;
    justify-content: left;
    align-content: center;    
    overflow: hidden;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
`

export const ResultButton = styled(TouchableOpacity)`
    background-color: ${third};
    justify-content: left;
    border-radius: 15px;
    margin-bottom: 12px;
    margin-left: 7px;
    margin-right: 7px;
    font-size: 16px;
    height: 90px;
    color: ${alb};
    flex-direction: row;
    align-items: center;
`


// Get the screen width
const screenWidth = Dimensions.get('window').width;

// Calculate the width and height for the image
const imageWidth = (screenWidth / 3) - 6;
const imageHeight = (screenWidth / 3) - 6;



export const MainContainer = styled(View)`
    align-items: center;
    justify-content: center;
`;

export const MainImage = styled(Image)`
    width: 250px;
    height: 250px;
    margin-bottom: 10px;
    elevation: 10;
`;

export const ProfilePicture = styled(Image)`
    border-radius: ${140 / 2}px;
    width: 140px;
    height: 140px;
`;

export const SmallerMainName = styled(Text)`
    color: ${Colors.alb};
    font-size: 18px;
    font-weight: bold;
    padding-right: 20px;
    flex-wrap: wrap;
    max-width: 200px;
`;

export const SmallerSecondayName = styled(Text)`
    color: ${Colors.alb};
    font-size: 15px;
`;

export const MainName = styled(Text)`
    color: ${Colors.alb};
    font-size: 24px;
    font-weight: bold;
`;

export const NameContainer = styled(View)`
    margin-top: 0;
`;

export const AlbumTouchable = styled(TouchableOpacity)`
    padding: 3px;
    align-items: center;
`;

export const AlbumImage = styled(Image)`
    width: ${imageWidth}px;
    height: ${imageHeight}px;
`;

