import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from './AuthContext';

export default function Home() {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // Navigation will be handled by AuthContext
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, {currentUser?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});