import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        email: decoded.sub,
                        role: localStorage.getItem('userRole'),
                        id: localStorage.getItem('userId'),
                        name: localStorage.getItem('userName'),
                        profileImageUrl: localStorage.getItem('profileImageUrl')
                    });
                }
            } catch (error) {
                console.error("Invalid token");
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            const { token, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('profileImageUrl', user.profileImageUrl || '');
            setUser({ email: user.email, role: user.role, id: user.id, name: user.name, profileImageUrl: user.profileImageUrl });
            
            if (user.role === 'ADMIN') navigate('/admin-dashboard');
            else if (user.role === 'SERVICE_PROVIDER') navigate('/provider-dashboard');
            else navigate('/customer-dashboard');
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            navigate('/login');
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('profileImageUrl');
        setUser(null);
        navigate('/login');
    };

    const updateProfileImage = (url) => {
        localStorage.setItem('profileImageUrl', url);
        setUser(prev => ({...prev, profileImageUrl: url}));
    };

    const value = { user, login, register, logout, loading, updateProfileImage };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
