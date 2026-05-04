// hooks/useSocialAuth.js
// Dùng chung cho Login và Register
// Web (Firebase Hosting): dùng signInWithPopup + getRedirectResult — KHÔNG dùng expo-auth-session
// Mobile (Expo Go/bare): vẫn dùng expo-auth-session như cũ

import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signInWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// ── Import expo packages chỉ khi KHÔNG phải web ──
// Tránh lỗi "unable to process request due to initial state" trên web
let WebBrowser, Google, Facebook;
if (Platform.OS !== 'web') {
    WebBrowser = require('expo-web-browser');
    Google = require('expo-auth-session/providers/google');
    Facebook = require('expo-auth-session/providers/facebook');
    WebBrowser.maybeCompleteAuthSession();
}

const FACEBOOK_APP_ID = '2078204966089322';
const GOOGLE_WEB_CLIENT = '832551425671-spk2j9c26cnv5gf8lf4tb1t4hms2nu7k.apps.googleusercontent.com';

// ── Lưu / đọc user Firestore (collection 'users' chữ thường) ──
async function getOrCreateUser(uid, displayName, email) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User đã tồn tại → trả về role + fullName
        return {
            role: userSnap.data().role || 'Học sinh',
            fullName: userSnap.data().fullName || displayName || 'Người dùng',
        };
    }

    // User mới → tạo document trong Firestore
    const newUser = {
        uid,
        fullName: displayName || 'Người dùng',
        email: (email || '').toLowerCase(),
        role: 'Học sinh',          // mặc định social login là Học sinh
        createdAt: serverTimestamp(),
    };
    await setDoc(userRef, newUser);
    return { role: 'Học sinh', fullName: newUser.fullName };
}

// ─────────────────────────────────────────────────────────────────
// Hook chính
// ─────────────────────────────────────────────────────────────────
export function useSocialAuth({ setUserName, setUserRole, navigation }) {
    const [socialLoading, setSocialLoading] = useState(null);
    const [socialError, setSocialError] = useState('');

    // ── Hooks expo-auth-session (chỉ gọi trên non-web) ──
    // Rules of Hooks: phải gọi unconditionally — dùng dummy nếu web
    const googleHook = (Platform.OS !== 'web' && Google)
        ? Google.useAuthRequest({ webClientId: GOOGLE_WEB_CLIENT, expoClientId: GOOGLE_WEB_CLIENT })
        : [null, null, async () => ({ type: 'dismiss' })];

    const fbHook = (Platform.OS !== 'web' && Facebook)
        ? Facebook.useAuthRequest({ clientId: FACEBOOK_APP_ID, scopes: ['public_profile'] })
        : [null, null, async () => ({ type: 'dismiss' })];

    const [, , googlePromptAsync] = googleHook;
    const [, , fbPromptAsync] = fbHook;

    // ── Điều hướng theo role ──
    const navigateByRole = (role) => {
        if (role === 'Giáo viên' || role === 'Admin') {
            navigation.navigate('MainTabsAdmin');
        } else {
            navigation.navigate('MainTabs');
        }
    };

    // ── Xử lý kết quả sau redirect (chạy khi app mount lại trên web) ──
    // Đây là bước quan trọng: getRedirectResult đọc kết quả OAuth sau khi
    // trình duyệt redirect về lại app-atoza.web.app
    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (!result) return; // Không có redirect result → bỏ qua

                setSocialLoading('redirecting');
                const { user } = result;
                const { role, fullName } = await getOrCreateUser(
                    user.uid, user.displayName, user.email
                );
                setUserName(fullName);
                setUserRole(role);
                navigateByRole(role);
            } catch (err) {
                // Bỏ qua lỗi "no redirect" bình thường
                if (err.code !== 'auth/no-auth-event') {
                    console.error('Redirect result error:', err.code, err.message);
                    setSocialError('Đăng nhập thất bại, vui lòng thử lại');
                }
            } finally {
                setSocialLoading(null);
            }
        };

        handleRedirectResult();
    }, []); // Chỉ chạy 1 lần khi mount

    // ── Handle Google ──
    const handleGoogle = async () => {
        setSocialError('');
        setSocialLoading('google');

        try {
            if (Platform.OS === 'web') {
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');

                try {
                    // Thử popup trước (Chrome desktop)
                    const result = await signInWithPopup(auth, provider);
                    const { user } = result;
                    const { role, fullName } = await getOrCreateUser(
                        user.uid, user.displayName, user.email
                    );
                    setUserName(fullName);
                    setUserRole(role);
                    navigateByRole(role);
                } catch (popupErr) {
                    // Popup bị block (Safari, mobile browser) → dùng redirect
                    // getRedirectResult() trong useEffect sẽ xử lý kết quả
                    if (
                        popupErr.code === 'auth/popup-blocked' ||
                        popupErr.code === 'auth/popup-closed-by-user' ||
                        popupErr.code === 'auth/cancelled-popup-request'
                    ) {
                        await signInWithRedirect(auth, provider);
                        // Sau dòng này trình duyệt sẽ redirect → app reload
                        // useEffect ở trên sẽ bắt getRedirectResult()
                        return;
                    }
                    throw popupErr; // Lỗi khác thì ném ra ngoài
                }
            } else {
                // ── Mobile (Expo Go / bare) ──
                const result = await googlePromptAsync();
                if (result?.type !== 'success') return;
                const { id_token } = result.params;
                const credential = GoogleAuthProvider.credential(id_token);
                const { user } = await signInWithCredential(auth, credential);
                const { role, fullName } = await getOrCreateUser(
                    user.uid, user.displayName, user.email
                );
                setUserName(fullName);
                setUserRole(role);
                navigateByRole(role);
            }
        } catch (err) {
            console.error('Google auth error:', err.code, err.message);
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
            if (Platform.OS === 'web') {
                const provider = new FacebookAuthProvider();
                provider.setCustomParameters({ scope: 'public_profile' });

                try {
                    // Thử popup trước
                    const result = await signInWithPopup(auth, provider);
                    const { user } = result;
                    const { role, fullName } = await getOrCreateUser(
                        user.uid, user.displayName, user.email
                    );
                    setUserName(fullName);
                    setUserRole(role);
                    navigateByRole(role);
                } catch (popupErr) {
                    // Popup bị block → redirect
                    if (
                        popupErr.code === 'auth/popup-blocked' ||
                        popupErr.code === 'auth/popup-closed-by-user' ||
                        popupErr.code === 'auth/cancelled-popup-request'
                    ) {
                        await signInWithRedirect(auth, provider);
                        return; // useEffect sẽ bắt kết quả
                    }
                    throw popupErr;
                }
            } else {
                // ── Mobile ──
                const result = await fbPromptAsync();
                if (result?.type !== 'success') return;
                const { access_token } = result.params;
                const credential = FacebookAuthProvider.credential(access_token);
                const { user } = await signInWithCredential(auth, credential);
                const { role, fullName } = await getOrCreateUser(
                    user.uid, user.displayName, user.email
                );
                setUserName(fullName);
                setUserRole(role);
                navigateByRole(role);
            }
        } catch (err) {
            console.error('Facebook auth error:', err.code, err.message);
            setSocialError('Đăng nhập Facebook thất bại, vui lòng thử lại');
        } finally {
            setSocialLoading(null);
        }
    };

    return { handleGoogle, handleFacebook, socialLoading, socialError, setSocialError };
}