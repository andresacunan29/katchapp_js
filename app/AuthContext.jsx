import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import React, { useContext, useState, useEffect } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doCreateUserWithEmailAndPassword, doSignOut } from './auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    async function initializeUser(user) {
        if (user) {
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const login = async (email, password) => {
        try {
            const result = await doSignInWithEmailAndPassword(email, password);
            setCurrentUser(result.user);
            setUserLoggedIn(true);
            return result;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const googleSignIn = async () => {
        try {
            const result = await doSignInWithGoogle();
            setCurrentUser(result.user);
            setUserLoggedIn(true);
            return result;
        } catch (error) {
            console.error("Google Sign-In error:", error);
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const result = await doCreateUserWithEmailAndPassword(email, password);
            setCurrentUser(result.user);
            setUserLoggedIn(true);
            return result;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await doSignOut();
            setCurrentUser(null);
            setUserLoggedIn(false);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    const value = {
        currentUser,
        userLoggedIn,
        loading,
        login,
        googleSignIn,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}