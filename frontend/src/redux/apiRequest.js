import axios from 'axios';
import { 
    loginFailed, 
    loginStart, 
    loginSuccess, 
    registerStart, 
    registerSuccess, 
    registerFailed, 
    logOutStart,
    logOutSuccess,
    logOutFailed
} from './authSlice'
import {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed
} from './userSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('/v1/auth/login', user);
        dispatch(loginSuccess(res.data));
        navigate('/');
    } catch (error) {
        dispatch(loginFailed());
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post('/v1/auth/register', user);
        dispatch(registerSuccess());
        navigate('/login');
    } catch (error) {
        dispatch(registerFailed());
    }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get('/v1/user', {
            headers: { token: `Bearer ${accessToken}`},
        });
        dispatch(getUsersSuccess(res.data));
    } catch (error) {
        dispatch(getUsersFailed());
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete('/v1/user/' + id, {
            headers: { token: `Bearer ${accessToken}`}
        });
        console.log('res.data: ', res.data)
        dispatch(deleteUserSuccess(res.data));
    } catch (error) {
        dispatch(deleteUserFailed(error.response?.data));
    }
}

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    console.log('ID: ', id);
    try {
        await axiosJWT.post('/v1/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}`}
        });
        dispatch(logOutSuccess());
        navigate('/login')
    } catch (error) {
        dispatch(logOutFailed(error.response?.data));
    }
}