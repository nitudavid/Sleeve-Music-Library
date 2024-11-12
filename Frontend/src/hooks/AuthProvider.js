import {useState, createContext, useEffect, useContext} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()

    const addUser = async (user) => {
        console.log("Add user data: ", user)
        setUser(user);
        await AsyncStorage.setItem("user", JSON.stringify(user));
    };

    const removeUser = async () => {
        setUser(null);
        await AsyncStorage.setItem("user", "");
        await AsyncStorage.setItem("jwt", "");
        console.log("Remove user data: ")
    };

    useEffect(() => {
        (async () => {
                const user = await AsyncStorage.getItem("user");
                console.log("date user curent", user)
                if (user) {
                    setUser(JSON.parse(user))
                    await addUser(JSON.parse(user));
                }}
        )()
    }, []);


    return <AuthContext.Provider
        value={{
            user,
            addUser,
            removeUser
        }}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};