import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE = "http://192.168.100.33:1338";

const apiClient = axios.create({
    baseURL: `${BASE}/api`,
});

apiClient.interceptors.request.use(async (config) => {
    let jwt = await AsyncStorage.getItem("jwtToken")

    // console.log("-->", jwt);

    if (config.url === "/auth/local") {
        jwt = null;
    }

    if (!!jwt) {
        config.headers["Authorization"] = `Bearer ${jwt}`;
    }

    return config;
});

export default apiClient;