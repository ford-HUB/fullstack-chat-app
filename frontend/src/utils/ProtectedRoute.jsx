import React, { useEffect, useState } from 'react';
import { authStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { userAuth, checkAuth } = authStore();
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth(); // Wait for auth check to complete
            setIsCheckingAuth(false);
        };
        
        verifyAuth();
    }, [checkAuth, userAuth]);

    useEffect(() => {
        if (!isCheckingAuth && !userAuth) {
            return navigate('/login');
        }
    }, [userAuth, isCheckingAuth, navigate]);

    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    return children;
};

export default ProtectedRoute;