import {TouchableOpacity, StyleSheet, Text} from "react-native";
import { Entypo } from "@expo/vector-icons";
import {Colors} from "./Styles";

const ButtonForPhoto = ({title, onPress, icon, color}) => {
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Entypo name={icon} size={28} color={color ? color : Colors.accent}/>
            <Text style={styles.text}> {title} </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.accent,
        marginLeft: 10,
    }
})

export default ButtonForPhoto