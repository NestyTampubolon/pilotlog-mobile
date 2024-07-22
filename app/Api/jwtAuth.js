// jwtAuth.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
const JwtAuthContext = createContext();
import { ApiManager, authenticatedRequest } from './ApiManager';


export const JwtAuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [jwtToken, setJwtToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const [userInfo, setUserInfo] = useState(null);
    const fetchJwtToken = async () => {
        const storedJwtToken = await AsyncStorage.getItem('jwtToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (!storedJwtToken || !storedRefreshToken) {
            // Tangani kasus ketika token tidak tersedia di AsyncStorage
            console.log("Token tidak tersedia di AsyncStorage");
            router.replace('/login');
            return;
        }

        if (storedJwtToken && storedRefreshToken) {
            try {
                const response = await authenticatedRequest('/api/v1/auth/users/profil', "GET",);
                console.log(response.status);
                if (response.status === 200) {
                    console.log("Token masih valid.");
                    setIsLoggedIn(true);
                    // router.replace('(tabsinstructor)');
                    //route.replace('(instructor/addGrade/1)')
                    const responses = await authenticatedRequest(`/api/v1/public/validation/${response.data.id_users}`, "GET",);
                    if (responses.status === 200) {
                        console.log("check");
                    }
                }
            } catch (error) {
                console.log('Error checking JWT token validity:', error.message);
                //logout();
            }
        }
    };


    // useEffect(() => {
    //     fetchJwtToken();
    // }, []);

    useEffect(() => {
         fetchJwtToken();
    });


    const login = async (email, password, onLoginFailed) => {
        try {
            const response = await ApiManager.post('/api/v1/auth/signin', {
                email,
                password,
            });
            if (response.data.token) {
                console.log(response.data.token);
                await AsyncStorage.setItem('jwtToken', response.data.token);
                setJwtToken(response.data.token);

                await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

                // Save the user data in the AsyncStorage
                await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.users));

                // Set the state to indicate successful login
                setIsLoggedIn(true);
                setJwtToken(response.data.token);
                setRefreshToken(response.data.refresh_token);
                // router.replace('(tabs)');

                if (response.data.users.role === "TRAINEE" || response.data.users.role === 'TRAINEE_INSTRUCTOR' || response.data.users.role === 'TRAINEE_CPTS') {
                    router.push('(tabs)');
                } else if (response.data.users.role === 'INSTRUCTOR' || response.data.users.role === 'INSTRUCTOR_CPTS') {
                    router.push('(tabsinstructor)');
                } else if (response.data.users.role === 'CPTS') {
                    router.push('(tabscpts)');
                }
            }

        } catch (error) {
            console.log('Login failed:' + error.message);
            if (onLoginFailed) {
                onLoginFailed('Invalid Email or Password');
            }
        }
    };

    const refreshTokenRequest = async (refreshToken) => {
        try {
            const response = await ApiManager.post('/api/v1/auth/refresh', {
                token: refreshToken,
            });

            return response.data;
        } catch (error) {
            console.log('Refresh token request failed:', error.message);
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            // Remove the JWT token from the AsyncStorage
            await AsyncStorage.removeItem('jwtToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('userInfo');

            // Clear the Authorization header
            delete axios.defaults.headers.common['Authorization'];


            // Set the state to indicate successful logout
            setIsLoggedIn(false);
            console.log("berhasil logout");
            console.log(await AsyncStorage.getItem('jwtToken'));
            setJwtToken(null);
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    return (
        <JwtAuthContext.Provider value={{ isLoggedIn, jwtToken, login, logout }}>
            {children}
        </JwtAuthContext.Provider>
    );
};

export const useJwtAuth = () => {
    const context = React.useContext(JwtAuthContext);
    if (!context) {
        throw new Error('useJwtAuth must be used within a JwtAuthProvider');
    }
    return context;
};