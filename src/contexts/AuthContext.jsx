'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from "../axios/axiosInstance";


const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        } else {
            if (window.location.pathname !== '/signin') {
                window.location.href = '/signin';
            }
        }
    }, []);

    const login = async (email, password) => {
        if (!email || !password) {
            alert('email and password are required');
            return;
        }

        try {
            const response = await axiosInstance.post('api/auth/login', {
                email,
                password
            });

            const data = response.data;
            console.log(data)
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('id', data.user._id);

                setUser({ token: data.token });
                window.location.href = '/';
            } else {
                throw new Error('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login Error:', error);

        }
    };

    const register = async (email: string, username: string, password: string): Promise<void> => {
        try {
            const response = await axiosInstance.post('api/auth/register', {email, username, password });
            console.log(response);
            window.location.href = '/signin';
        } catch (error) {
            console.error('Register failed:', error);
            alert('Register failed!');
        }
    };


    const logout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/signin';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
