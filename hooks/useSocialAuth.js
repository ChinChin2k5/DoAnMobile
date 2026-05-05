// hooks/useSocialAuth.js
import { useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithCredential,
    signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const FACEBOOK_APP_ID   = '2078204966089322';
const GOOGLE_WEB_CLIENT = '832551425671-spk2j9c26cnv5gf8lf4tb1t4hms2nu7k.apps.googleusercontent.com';


async function getOrCreateUser(uid, displayName, email) {
    const userRef  = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return {
            role:     userSnap.data().role     || 'student',
            fullName: userSnap.data().fullName || displayName || 'Người dùng',
        };
    }
    const newUser = {
        uid,
        fullName:  displayName || 'Người dùng',
        email:     (email || '').toLowerCase(),
        role:      'student',
        createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newUser);
    return { role: newUser.role, fullName: newUser.fullName };
}

export function useSocialAuth({ setUserName, setUserRole, navigation }) {
    const [socialLoading, setSocialLoading] = useState(null);
    const [socialError,   setSocialError]   = useState('');

    // Native hooks — phải gọi unconditionally
    const [, gResponse, gPromptAsync] = Google.useAuthRequest({
        webClientId:  GOOGLE_WEB_CLIENT,
        expoClientId: GOOGLE_WEB_CLIENT,
        androidClientId: GOOGLE_WEB_CLIENT,
    });
    const [, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
        scopes:   ['public_profile'],
    });

    const navigateByRole = (role) => {
        if (role === 'teacher' || role === 'admin') {
            navigation.navigate('MainTabsAdmin');
        } else {
            navigation.navigate('MainTabs');
        }
    };

    const processSignIn = async (user) => {
        const { role, fullName } = await getOrCreateUser(
            user.uid, user.displayName, user.email
        );
        setUserName(fullName);
        setUserRole(role);
        navigateByRole(role);
    };

    // Google
    const handleGoogle = async () => {
        setSocialError('');
        setSocialLoading('google');
        try {
            if (Platform.OS === 'web') {
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                const result = await signInWithPopup(auth, provider);
                await processSignIn(result.user);
            } else {
                const result = await gPromptAsync();
                if (result?.type !== 'success') return;
                const credential = GoogleAuthProvider.credential(result.params.id_token);
                const { user } = await signInWithCredential(auth, credential);
                await processSignIn(user);
            }
        } catch (err) {
            console.error('[Google]', err.code, err.message);
            setSocialError('Đăng nhập Google thất bại, vui lòng thử lại');
        } finally {
            setSocialLoading(null);
        }
    };

    // Facebook
    const handleFacebook = async () => {
        setSocialError('');
        setSocialLoading('facebook');
        try {
            if (Platform.OS === 'web') {
                const provider = new FacebookAuthProvider();
                provider.setCustomParameters({ scope: 'public_profile' });
                const result = await signInWithPopup(auth, provider);
                await processSignIn(result.user);
            } else {
                const result = await fbPromptAsync();
                if (result?.type !== 'success') return;
                const credential = FacebookAuthProvider.credential(result.params.access_token);
                const { user } = await signInWithCredential(auth, credential);
                await processSignIn(user);
            }
        } catch (err) {
            console.error('[Facebook]', err.code, err.message);
            setSocialError(`FB Error: ${err.code} - ${err.message}`);
        } finally {
            setSocialLoading(null);
        }
    };

    return { handleGoogle, handleFacebook, socialLoading, socialError, setSocialError };
}