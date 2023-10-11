import axios from "axios";
import jwt_decode from 'jwt-decode';
import refreshToken from "./refreshToken";

const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken
                }
                // Update info user
                dispatch(stateSuccess(refreshUser));
                config.headers['token'] = `Bearer ${refreshUser.accessToken}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        })
    return newInstance;
}

export default createAxios;
