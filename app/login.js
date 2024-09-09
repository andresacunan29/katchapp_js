import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';

export default function Login() {
    const { login, googleSignIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            // Navigation will be handled by AuthContext
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            // Navigation will be handled by AuthContext
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
                <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});