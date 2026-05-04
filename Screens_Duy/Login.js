import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions,
    Image, Animated, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

// ── Firebase ──
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// ── Social Auth ──
import { useSocialAuth } from '../hooks/useSocialAuth';

const { width } = Dimensions.get('window');
//Loại bỏ gây trùng tên
// const auth = getAuth();

const BG_DOTS = [
    { top: 60, left: 30, size: 120, opacity: 0.06 },
    { top: 200, left: width - 80, size: 80, opacity: 0.08 },
    { top: 380, left: 10, size: 60, opacity: 0.05 },
    { top: 500, left: width - 50, size: 100, opacity: 0.07 },
];

export default function Login({ navigation }) {
    const [activeRole, setActiveRole] = useState('Học sinh');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');
    const { setUserName, setUserRole } = useContext(UserContext);

    // ── Social Auth Hook ──
    const { handleGoogle, handleFacebook, socialLoading, socialError, setSocialError } = useSocialAuth({
        setUserName, setUserRole, navigation,
    });

    const [errors, setErrors] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });

    const animatedValue = useRef(new Animated.Value(0)).current;
    const shakeEmail = useRef(new Animated.Value(0)).current;
    const shakePassword = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(1)).current;
    const logoTimer = useRef(null);

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: activeRole === 'Học sinh' ? 0 : 1,
            speed: 14, bounciness: 6, useNativeDriver: false,
        }).start();
    }, [activeRole]);

    const isTeacher = activeRole === 'Giáo viên';
    const accentColor = isTeacher ? '#F57C00' : '#3B5BDB';
    const bgColors = isTeacher
        ? ['#FFF9F0', '#FFF4E0', '#FFF0D0']
        : ['#EEF2FF', '#E8EFFE', '#DCE4FD'];
    const loginGradient = isTeacher ? ['#FFB74D', '#F57C00'] : ['#4C6EF5', '#3B5BDB'];

    const cardBgColor = animatedValue.interpolate({
        inputRange: [0, 1], outputRange: ['#FFFFFF', '#FFFDF7'],
    });
    const dotColor = animatedValue.interpolate({
        inputRange: [0, 1], outputRange: ['#3B5BDB', '#F57C00'],
    });
    const studentTabStyle = {
        transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1.02, 1] }) }],
    };
    const teacherTabStyle = {
        transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }],
    };

    const triggerShake = (anim) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -6, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    };

    const validate = () => {
        let newErrors = { email: '', password: '' };
        if (!email)
            newErrors.email = 'Email không được để trống';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = 'Email không hợp lệ';
        if (!password)
            newErrors.password = 'Mật khẩu không được để trống';
        else if (password.length < 6)
            newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
        setErrors(newErrors);
        return newErrors;
    };

    const parseFirebaseError = (code) => {
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password': return 'Email hoặc mật khẩu không đúng';
            case 'auth/too-many-requests': return 'Quá nhiều lần thử, vui lòng thử lại sau';
            case 'auth/network-request-failed': return 'Lỗi kết nối mạng';
            default: return 'Đăng nhập thất bại, vui lòng thử lại';
        }
    };

    // ── Handle Login: Auth → Firestore users (chữ thường) ──
    const handleLogin = async () => {
        setTouched({ email: true, password: true });
        setFirebaseError('');
        const validation = validate();
        if (validation.email) triggerShake(shakeEmail);
        if (validation.password) triggerShake(shakePassword);
        if (validation.email || validation.password) return;

        setLoading(true);
        try {
            // Bước 1: Xác thực Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const uid = userCredential.user.uid;

            // Bước 2: Đọc role + fullName từ Firestore — collection 'users' (chữ thường)
            const userDoc = await getDoc(doc(db, 'users', uid));
            let role = activeRole;
            let fullName = email;
            if (userDoc.exists()) {
                role = userDoc.data().role || activeRole;
                fullName = userDoc.data().fullName || email;
            }

            setUserName(fullName);
            setUserRole(role);

            // Bước 3: Điều hướng theo role
            if (role === 'Giáo viên' || role === 'Admin') {
                navigation.navigate('MainTabsAdmin');
            } else {
                navigation.navigate('MainTabs');
            }
        } catch (error) {
            setFirebaseError(parseFirebaseError(error.code));
            triggerShake(shakeEmail);
            triggerShake(shakePassword);
        } finally {
            setLoading(false);
        }
    };

    // ── Admin ẩn: nhấn giữ Logo 3 giây ──
    const handleLogoPressIn = () => {
        Animated.spring(logoScale, {
            toValue: 0.85,
            useNativeDriver: true, // nên để true cho scale
        }).start();

        logoTimer.current = setTimeout(() => {
            Animated.spring(logoScale, {
                toValue: 1,
                useNativeDriver: true,
            }).start();

            setUserName('Admin');
            setUserRole('Admin');
            navigation.navigate('MainTabsAdmin');
        }, 3000);
    };

    const handleLogoPressOut = () => {
        if (logoTimer.current) {
            clearTimeout(logoTimer.current);
            logoTimer.current = null;
        }
        Animated.spring(logoScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <LinearGradient colors={bgColors} style={StyleSheet.absoluteFill}>
                {BG_DOTS.map((dot, i) => (
                    <Animated.View key={i} style={{
                        position: 'absolute', top: dot.top, left: dot.left,
                        width: dot.size, height: dot.size,
                        borderRadius: dot.size / 2,
                        backgroundColor: dotColor, opacity: dot.opacity,
                    }} />
                ))}
                <Animated.View style={[styles.bgCircleLarge, { backgroundColor: dotColor, opacity: 0.06 }]} />
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Logo (giữ 3s → Admin) + Real-time role hint ── */}
                <View style={styles.brandRow}>
                    <TouchableOpacity
                        onPressIn={handleLogoPressIn}
                        onPressOut={handleLogoPressOut}
                        onLongPress={() => { }}
                        delayLongPress={3000}
                        activeOpacity={1}
                    >
                        <Animated.View style={[styles.logoBox, { borderColor: dotColor, transform: [{ scale: logoScale }] }]}>
                            <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                        </Animated.View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.brandName}>Atoza</Text>
                        <Animated.Text style={[styles.roleHint, { color: dotColor }]}>
                            Đăng nhập: {isTeacher ? 'Giáo viên' : 'Học sinh'}
                        </Animated.Text>
                    </View>
                </View>

                {/* ── Card ── */}
                <Animated.View style={[styles.contentCard, { backgroundColor: cardBgColor }]}>
                    <Text style={styles.title}>Đăng nhập</Text>
                    <Text style={styles.subtitle}>
                        Vui lòng nhập thông tin để truy cập vào tài khoản của bạn.
                    </Text>

                    {/* ── Tab Role ── */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Học sinh')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn, !isTeacher && styles.tabBtnActive,
                                studentTabStyle, !isTeacher && { borderColor: '#3B5BDB' },
                            ]}>
                                <FontAwesome5 name="user-graduate" size={13}
                                    color={!isTeacher ? '#3B5BDB' : '#A0AEC0'} style={{ marginBottom: 3 }} />
                                <Text style={[styles.tabText, !isTeacher && styles.tabTextBlue]}>Học sinh</Text>
                            </Animated.View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Giáo viên')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn, isTeacher && styles.tabBtnActive,
                                teacherTabStyle, isTeacher && { borderColor: '#F57C00' },
                            ]}>
                                <FontAwesome5 name="chalkboard-teacher" size={13}
                                    color={isTeacher ? '#F57C00' : '#A0AEC0'} style={{ marginBottom: 3 }} />
                                <Text style={[styles.tabText, isTeacher && styles.tabTextOrange]}>Giáo viên</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* ── Firebase error banner ── */}
                    {firebaseError ? (
                        <View style={styles.errorBanner}>
                            <Feather name="alert-circle" size={14} color="#E53935" />
                            <Text style={styles.errorBannerText}>{firebaseError}</Text>
                        </View>
                    ) : null}

                    {/* ── Email ── */}
                    <Text style={styles.label}>EMAIL</Text>
                    <Animated.View style={[styles.inputBox, {
                        transform: [{ translateX: shakeEmail }],
                        borderColor: (errors.email && touched.email) ? '#E53935'
                            : email ? accentColor + '55' : '#E8ECF4',
                    }]}>
                        <Feather name="mail" size={18} color={email ? accentColor : '#A0AEC0'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="example@atoza.vn"
                            placeholderTextColor="#C0C9D8"
                            value={email}
                            onChangeText={(t) => { setEmail(t); setFirebaseError(''); if (touched.email) validate(); }}
                            onBlur={() => { setTouched(p => ({ ...p, email: true })); validate(); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Animated.View>
                    {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                    {/* ── Mật khẩu ── */}
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>MẬT KHẨU</Text>
                        <TouchableOpacity>
                            <Text style={[styles.forgotText, { color: accentColor }]}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={[styles.inputBox, {
                        transform: [{ translateX: shakePassword }],
                        borderColor: (errors.password && touched.password) ? '#E53935'
                            : password ? accentColor + '55' : '#E8ECF4',
                    }]}>
                        <Feather name="lock" size={18} color={password ? accentColor : '#A0AEC0'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#C0C9D8"
                            value={password}
                            onChangeText={(t) => { setPassword(t); setFirebaseError(''); if (touched.password) validate(); }}
                            onBlur={() => { setTouched(p => ({ ...p, password: true })); validate(); }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#A0AEC0" />
                        </TouchableOpacity>
                    </Animated.View>
                    {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    {/* ── Nút Đăng nhập ── */}
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} disabled={loading}
                        style={{ marginTop: 8, marginBottom: 28 }}>
                        <LinearGradient colors={loginGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <View style={styles.loginIconLeft}>
                                        <FontAwesome5 name={isTeacher ? 'chalkboard-teacher' : 'user-graduate'}
                                            size={16} color="rgba(255,255,255,0.85)" />
                                    </View>
                                    <Text style={styles.loginBtnText}>Đăng nhập</Text>
                                    <View style={styles.loginIconRight}>
                                        <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.85)" />
                                    </View>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ── Divider ── */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* ── Social error banner ── */}
                    {socialError ? (
                        <View style={styles.errorBanner}>
                            <Feather name="alert-circle" size={14} color="#E53935" />
                            <Text style={styles.errorBannerText}>{socialError}</Text>
                        </View>
                    ) : null}

                    {/* ── Social ── */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity
                            style={[styles.socialPill, socialLoading === 'google' && styles.socialPillLoading]}
                            activeOpacity={0.8}
                            onPress={handleGoogle}
                            disabled={!!socialLoading}
                        >
                            {socialLoading === 'google'
                                ? <ActivityIndicator size="small" color="#EA4335" />
                                : <>
                                    <FontAwesome5 name="google" size={17} color="#EA4335" solid />
                                    <Text style={styles.socialPillText}>Google</Text>
                                </>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.socialPill, socialLoading === 'facebook' && styles.socialPillLoading]}
                            activeOpacity={0.8}
                            onPress={handleFacebook}
                            disabled={!!socialLoading}
                        >
                            {socialLoading === 'facebook'
                                ? <ActivityIndicator size="small" color="#1877F2" />
                                : <>
                                    <FontAwesome5 name="facebook" size={17} color="#1877F2" solid />
                                    <Text style={styles.socialPillText}>Facebook</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* ── Footer ── */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerHint}>Bạn mới biết đến Atoza? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={[styles.registerLink, { color: accentColor }]}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>

                {/* Hint ẩn cho dev — xóa khi production */}
                <Text style={styles.adminHint}> Giữ logo ATOZA 3 giây để vào Admin</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 48 },
    bgCircleLarge: { position: 'absolute', top: -60, right: -80, width: 300, height: 300, borderRadius: 150 },

    brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 },
    logoBox: {
        width: 46, height: 46, borderRadius: 12, backgroundColor: '#EEF2FF',
        justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
    },
    logoImage: { width: 30, height: 30 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#1A202C', letterSpacing: 0.3 },
    roleHint: { fontSize: 11, fontWeight: '600', marginTop: 2 },

    contentCard: {
        borderRadius: 24, paddingHorizontal: 22, paddingVertical: 28,
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1, shadowRadius: 16, elevation: 5, marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 13, color: '#718096', lineHeight: 20, marginBottom: 24, textAlign: 'center' },

    tabRow: { flexDirection: 'row', backgroundColor: '#F0F2F8', borderRadius: 16, padding: 5, marginBottom: 24, gap: 4 },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    tabBtnActive: {
        backgroundColor: '#FFFFFF', borderWidth: 1.5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6,
    },
    tabText: { fontSize: 13, fontWeight: '600', color: '#A0AEC0' },
    tabTextBlue: { color: '#3B5BDB' },
    tabTextOrange: { color: '#F57C00' },

    errorBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#FFEBEE', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14,
    },
    errorBannerText: { color: '#E53935', fontSize: 12, fontWeight: '600', flex: 1 },

    label: { fontSize: 11, fontWeight: '700', color: '#718096', letterSpacing: 1, marginBottom: 8 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 8 },
    forgotText: { fontSize: 12, fontWeight: '700' },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FC',
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 14, borderWidth: 1.5,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 14, color: '#1A202C' },
    errorText: { color: '#E53935', fontSize: 11, marginTop: -10, marginBottom: 10, marginLeft: 4 },

    loginBtn: {
        borderRadius: 50, paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', position: 'relative', minHeight: 54,
        shadowColor: '#3B5BDB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    loginIconLeft: { position: 'absolute', left: 22 },
    loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
    loginIconRight: { position: 'absolute', right: 22 },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E8ECF4' },
    dividerText: { fontSize: 10, fontWeight: '700', color: '#A0AEC0', letterSpacing: 1, marginHorizontal: 10 },

    socialRow: { flexDirection: 'row', gap: 12 },
    socialPill: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFFFFF', borderRadius: 50, paddingVertical: 13, gap: 8,
        borderWidth: 1.5, borderColor: '#E8ECF4',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    socialPillText: { fontSize: 13, fontWeight: '700', color: '#2D3748' },
    socialPillLoading: { opacity: 0.6 },

    registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    registerHint: { fontSize: 11, color: '#718096' },
    registerLink: { fontSize: 11, fontWeight: '700' },
    adminHint: {
        textAlign: 'center',
        fontSize: 9,
        color: '#7373a8',
        marginTop: 4,
        opacity: 0.8,
    },
});