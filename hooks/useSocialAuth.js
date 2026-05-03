// hooks/useSocialAuth.js
// Dùng chung cho Login và Register
// Yêu cầu: npx expo install expo-auth-session expo-crypto expo-web-browser

import { useState } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Bắt buộc gọi để đóng browser popup sau khi auth xong
WebBrowser.maybeCompleteAuthSession();

// ── Constants ──
const FACEBOOK_APP_ID = '2078204966089322';

// ─────────────────────────────────────────────
// Hàm dùng chung: sau khi có credential từ Google/Facebook,
// sign in Firebase → kiểm tra/tạo Firestore doc → trả về role
// ─────────────────────────────────────────────
async function firebaseSignInAndGetRole(credential, displayName, email) {
    // 1. Đăng nhập Firebase Auth
    const userCredential = await signInWithCredential(auth, credential);
    const { uid } = userCredential.user;

    // 2. Kiểm tra Firestore — user đã tồn tại chưa?
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User cũ → trả về role hiện tại
        return userSnap.data().role || 'student';
    }

    // User mới (lần đầu đăng nhập bằng social) → tạo document
    await setDoc(userRef, {
        uid,
        fullName:  displayName || 'Người dùng',
        email:     (email || '').toLowerCase(),  // Facebook có thể trả về rỗng nếu chưa được phê duyệt scope email
        role:      'student',   // Social login mặc định là student
        provider:  email ? 'social' : 'facebook_no_email',
        createdAt: serverTimestamp(),
    });

    return 'student';
}

// ─────────────────────────────────────────────
// Hook chính export ra ngoài
// ─────────────────────────────────────────────
export function useSocialAuth({ setUserName, setUserRole, navigation }) {
    const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'facebook' | null
    const [socialError,   setSocialError]   = useState('');

    // ── Google Auth Request ──
    const [, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        webClientId:  '832551425671-spk2j9c26cnv5gf8lf4tb1t4hms2nu7k.apps.googleusercontent.com',
        expoClientId: '832551425671-spk2j9c26cnv5gf8lf4tb1t4hms2nu7k.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({
            scheme: 'https',
            path:   'auth.expo.io/@nguyendinhduy2578921113/DoAnMobile',
        }),
    });

    // ── Facebook Auth Request ──
    const [, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
        scopes: ['public_profile'],   // Bỏ 'email' — App chưa được Facebook phê duyệt scope này
    });

    // ── Navigate theo role ──
    const navigateByRole = (role) => {
        if (role === 'teacher' || role === 'admin') {
            navigation.navigate('MainTabsAdmin');
        } else {
            navigation.navigate('MainTabs');
        }
    };

    // ── Handle Google ──
    const handleGoogle = async () => {
        setSocialError('');
        setSocialLoading('google');
        try {
            const result = await googlePromptAsync();
            if (result?.type !== 'success') {
                // User đóng popup hoặc cancel — không báo lỗi
                return;
            }

            const { id_token } = result.params;
            const credential = GoogleAuthProvider.credential(id_token);
            const { user } = await signInWithCredential(auth, credential);

            const role = await firebaseSignInAndGetRole(
                credential,
                user.displayName,
                user.email,
            );

            setUserName(user.displayName || 'Người dùng');
            setUserRole(role);
            navigateByRole(role);
        } catch (err) {
            console.error('Google auth error:', err);
            setSocialError('Đăng nhập Google thất bại, vui lòng thử lại');
        } finally {
            setSocialLoading(null);
        }
    };

    // ── Handle Facebook ──
    const handleFacebook = async () => {
        setSocialError('');
        setSocialLoading('facebook');
        try {
            const result = await fbPromptAsync();
            if (result?.type !== 'success') {
                return;
            }

            const { access_token } = result.params;
            const credential = FacebookAuthProvider.credential(access_token);
            const { user } = await signInWithCredential(auth, credential);

            const role = await firebaseSignInAndGetRole(
                credential,
                user.displayName,
                user.email,
            );

            setUserName(user.displayName || 'Người dùng');
            setUserRole(role);
            navigateByRole(role);
        } catch (err) {
            console.error('Facebook auth error:', err);
            setSocialError('Đăng nhập Facebook thất bại, vui lòng thử lại');
        } finally {
            setSocialLoading(null);
        }
    };

    return {
        handleGoogle,
        handleFacebook,
        socialLoading,
        socialError,
        setSocialError,
    };
}