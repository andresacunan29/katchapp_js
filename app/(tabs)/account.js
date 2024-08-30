import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';

export default function Account() {
  const { user, login, logout, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match. Please try again.');
          return;
        }
        await register(email, password);
        Alert.alert('Success', 'Registration successful!');
      } else {
        await login(email, password);
        Alert.alert('Success', 'Login successful!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logged out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.email}!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Create Account' : 'Login'}</Text>
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {isRegistering && (
        <>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </>
      )}
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAuth}
      >
        <Text style={styles.buttonText}>{isRegistering ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }}>
        <Text style={styles.switchText}>
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
});