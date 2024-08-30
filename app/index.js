import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

const Splash = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(tabs)/account');
        }
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>KatchApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 25,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Splash;