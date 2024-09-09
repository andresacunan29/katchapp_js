import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';// Import the AuthContext to use googleSignIn

export default function Account() {
  const { currentUser, login, register, logout, googleSignIn } = useAuth(); // Destructure googleSignIn
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setIsLoading(true);  // Show loading state
    try {
      if (isRegistering) {
        await register(email, password);
        Alert.alert("Success", "Registration successful!");
      } else {
        await login(email, password);
        Alert.alert("Success", "Login successful!");
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false); // Stop loading after completion
    }
  };

const handleGoogleSignIn = async() => {
  try {
    await googleSignIn(); // call googleSignIn from AuthContext
    Alert.alert("Success", "Signed in with Google successfully!");
  } catch (error) {
    Alert.alert("Error" , error.message);
  }
};

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {currentUser.email}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAuth} 
        disabled={isLoading}  // Disable button while loading
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')} {/* Show loading text */}
        </Text>
      </TouchableOpacity>

      {/* Button for Google Sign In */}
      <TouchableOpacity 
        style={[styles.button, styles.googleButton]} 
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
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
  googleButton: {
    backgroundColor: '#DB4437', // Google's brand color for the button
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
});
