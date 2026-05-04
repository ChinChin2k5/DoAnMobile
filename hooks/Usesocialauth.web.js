import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Bắt buộc để trình duyệt tự đóng sau khi đăng nhập
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

    // Cấu hình Google: Sử dụng Proxy để chạy được trên Expo Go cho cả 2 OS
    const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_WEB_CLIENT,
        // Dùng Proxy của Expo để thống nhất Redirect URI
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    // Cấu hình Facebook
    const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    const navigateByRole = (role) => {
        if (role === 'teacher' || role === 'admin') {
            navigation.navigate('MainTabsAdmin');
        } else {
            navigation.navigate('MainTabs');
        }
    };

    // Xử lý kết quả Google
    useEffect(() => {
        if (gResponse?.type === 'success') {
            const { id_token } = gResponse.params;
            const credential = GoogleAuthProvider.credential(id_token);
            handleFirebaseSignIn(credential, 'google');
        }
    }, [gResponse]);

    // Xử lý kết quả Facebook
    useEffect(() => {
        if (fbResponse?.type === 'success') {
            const { access_token } = fbResponse.params;
            const credential = FacebookAuthProvider.credential(access_token);
            handleFirebaseSignIn(credential, 'facebook');
        }
    }, [fbResponse]);

    const handleFirebaseSignIn = async (credential, providerName) => {
        setSocialLoading(providerName);
        try {
            const { user } = await signInWithCredential(auth, credential);
            const { role, fullName } = await getOrCreateUser(user.uid, user.displayName, user.email);
            setUserName(fullName);
            setUserRole(role);
            navigateByRole(role);
        } catch (err) {
            console.error(`[SocialAuth.native] ${providerName}:`, err.message);
            setSocialError(`Đăng nhập ${providerName} thất bại`);
        } finally {
            setSocialLoading(null);
        }
    };

    return { 
        handleGoogle: () => gPromptAsync(), 
        handleFacebook: () => fbPromptAsync(), 
        socialLoading, 
        socialError, 
        setSocialError 
    };
}