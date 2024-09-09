import { 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithCredential,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { auth } from './firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth } from "firebase/auth";
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession(); // Required for web-browser redirects in Expo

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

// Updated Google Sign-In function for React Native
export const doSignInWithGoogle = async () => {
    try {
        const config = {
            androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
            iosClientId: '<YOUR_IOS_CLIENT_ID>',
            expoClientId: '<YOUR_EXPO_CLIENT_ID>',
        };
        
        const [request, response, promptAsync] = Google.useAuthRequest({
            expoClientId: config.expoClientId,
            androidClientId: config.androidClientId,
            iosClientId: config.iosClientId,
        });

        // Prompt the user to sign in with Google
        const result = await promptAsync();

        if (result.type === 'success') {
            const { id_token } = result.params;

            // Use the OAuth token to sign in with Firebase
            const credential = GoogleAuthProvider.credential(id_token);
            const authResult = await signInWithCredential(auth, credential);
            return authResult; // Contains user and credentials
        } else {
            throw new Error("Google sign-in failed.");
        }
    } catch (error) {
        console.error("Google Sign-In error:", error);
        throw error;
    }
};

export const doSignOut = async () => {
    return await signOut(auth);
};

export const doPasswordReset = async (email) => {
    return await sendPasswordResetEmail(auth, email); 
};

export const doSendEmailVerification = async () => {
    if (auth.currentUser) {
        return await sendEmailVerification(auth.currentUser);
    } else {
        throw new Error("No user is currently signed in.");
    }
};

export const doUpdateProfile = async (displayName, photoURL) => {
    if (auth.currentUser) {
        return await updateProfile(auth.currentUser, { displayName, photoURL });
    } else {
        throw new Error("No user is currently signed in.");
    }
};
