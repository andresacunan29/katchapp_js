import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';

export default function Layout() {
    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}