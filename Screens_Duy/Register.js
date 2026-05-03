import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions,
    Image, Animated, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

// ── Context ──
import { UserContext } from '../context/UserContext';

// ── Firebase ──
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// ── Social Auth ──
import { useSocialAuth } from '../hooks/useSocialAuth';

const { width } = Dimensions.get('window');
//loại bỏ trùng lặp auth
// const auth = getAuth();

const BG_DOTS = [
    { top: 60, left: 30, size: 120, opacity: 0.06 },
    { top: 200, left: width - 80, size: 80, opacity: 0.08 },
    { top: 380, left: 10, size: 60, opacity: 0.05 },
    { top: 500, left: width - 50, size: 100, opacity: 0.07 },
];

export default function Register({ navigation }) {
    const [activeRole, setActiveRole] = useState('Học sinh');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');

    // ── Social Auth Hook ──
    const { setUserName, setUserRole } = useContext(UserContext);
    const { handleGoogle, handleFacebook, socialLoading, socialError } = useSocialAuth({
        setUserName, setUserRole, navigation,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        fullName: false, email: false, password: false, confirmPassword: false,
    });

    // ── Animated ──
    const animatedValue = useRef(new Animated.Value(0)).current;
    const shakeFullName = useRef(new Animated.Value(0)).current;
    const shakeEmail = useRef(new Animated.Value(0)).current;
    const shakePassword = useRef(new Animated.Value(0)).current;
    const shakeConfirmPw = useRef(new Animated.Value(0)).current;

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
    const registerGradientColors = isTeacher
        ? ['#FFB74D', '#F57C00']
        : ['#4C6EF5', '#3B5BDB'];

    // ── Real-time role label ──
    const roleLabel = isTeacher ? 'Giáo viên' : 'Học sinh';

    // ── Animated interpolations ──
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

    // ── Shake helper ──
    const triggerShake = (anim) => {
        Animated.sequence([
            Animated.timing(anim, { toValue: 10, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -10, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: -6, duration: 40, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    };

    // ── Sanitize ──
    const sanitize = (text) => text.replace(/[<>]/g, '');

    // ── Validate ──
    const validate = () => {
        let newErrors = {};

        if (!fullName.trim()) newErrors.fullName = 'Không được để trống';
        else if (fullName.length < 2 || fullName.length > 50) newErrors.fullName = 'Tên phải từ 2–50 ký tự';
        else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) newErrors.fullName = 'Tên không hợp lệ';

        const emailRegex = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+\.[a-z]{2,}$/;
        if (!email) newErrors.email = 'Email không được để trống';
        else if (!emailRegex.test(email.toLowerCase())) newErrors.email = 'Email không hợp lệ';

        if (!password) newErrors.password = 'Không được để trống';
        else if (password.length < 8) newErrors.password = 'Ít nhất 8 ký tự';
        else if (!/[A-Z]/.test(password)) newErrors.password = 'Cần có chữ hoa';
        else if (!/[a-z]/.test(password)) newErrors.password = 'Cần có chữ thường';
        else if (!/[0-9]/.test(password)) newErrors.password = 'Cần có chữ số';
        else if (!/[!@#$%^&*]/.test(password)) newErrors.password = 'Cần ký tự đặc biệt (!@#$%^&*)';

        if (!confirmPassword) newErrors.confirmPassword = 'Không được để trống';
        else if (confirmPassword !== password) newErrors.confirmPassword = 'Mật khẩu không khớp';

        setErrors(newErrors);
        return newErrors;
    };

    // ── Firebase error messages ──
    const parseFirebaseError = (code) => {
        switch (code) {
            case 'auth/email-already-in-use': return 'Email này đã được đăng ký';
            case 'auth/weak-password': return 'Mật khẩu quá yếu';
            case 'auth/invalid-email': return 'Email không hợp lệ';
            case 'auth/network-request-failed': return 'Lỗi kết nối mạng';
            default: return 'Đăng ký thất bại, vui lòng thử lại';
        }
    };

    // ── Handle Register ──
    const handleRegister = async () => {
        setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
        setFirebaseError('');

        const validation = validate();
        if (validation.fullName) triggerShake(shakeFullName);
        if (validation.email) triggerShake(shakeEmail);
        if (validation.password) triggerShake(shakePassword);
        if (validation.confirmPassword) triggerShake(shakeConfirmPw);
        if (Object.keys(validation).length > 0) return;

        setLoading(true);
        try {
            // Tạo tài khoản Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Lưu thông tin vào Firestore
            await setDoc(doc(db, 'users', uid), {
                uid,
                fullName: fullName.trim(),
                email: email.toLowerCase(),
                role: activeRole,       // 'Học sinh' | 'Giáo viên'
                createdAt: serverTimestamp(),
            });

            // Điều hướng về màn hình đăng nhập (hoặc thẳng vào app tùy flow)
            navigation.navigate('Login');
        } catch (error) {
            setFirebaseError(parseFirebaseError(error.code));
        } finally {
            setLoading(false);
        }
    };

    // ── Helper render input ──
    const renderInput = ({
        label, iconName, value, onChangeText, onBlur,
        placeholder, secureTextEntry, keyboardType,
        autoCapitalize, rightElement, shakeAnim, errorKey,
    }) => (
        <>
            <Text style={styles.label}>{label}</Text>
            <Animated.View style={[styles.inputBox, {
                transform: [{ translateX: shakeAnim }],
                borderColor: errors[errorKey] && touched[errorKey]
                    ? '#E53935'
                    : value ? accentColor + '55' : '#E8ECF4',
            }]}>
                <Feather name={iconName} size={18}
                    color={value ? accentColor : '#A0AEC0'} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#C0C9D8"
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize || 'sentences'}
                />
                {rightElement}
            </Animated.View>
            {touched[errorKey] && errors[errorKey]
                ? <Text style={styles.errorText}>{errors[errorKey]}</Text>
                : null}
        </>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            {/* Nền gradient */}
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
                {/* ── Logo + Brand ── */}
                <View style={styles.brandRow}>
                    <Animated.View style={[styles.logoBox, { borderColor: dotColor }]}>
                        <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                    </Animated.View>
                    <View>
                        <Text style={styles.brandName}>Atoza</Text>
                        {/* Real-time role label */}
                        <Animated.Text style={[styles.roleHint, { color: dotColor }]}>
                            Đăng ký: {roleLabel}
                        </Animated.Text>
                    </View>
                </View>

                {/* ── Card chính ── */}
                <Animated.View style={[styles.contentCard, { backgroundColor: cardBgColor }]}>

                    {/* Badge "Đăng ký" phân biệt với Login */}
                    <View style={[styles.screenBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '44' }]}>
                        <Feather name="user-plus" size={13} color={accentColor} />
                        <Text style={[styles.screenBadgeText, { color: accentColor }]}>Tạo tài khoản mới</Text>
                    </View>

                    <Text style={styles.title}>Đăng ký</Text>
                    <Text style={styles.subtitle}>
                        Điền thông tin bên dưới để tạo tài khoản của bạn.
                    </Text>

                    {/* ── Tab Role (không có Admin) ── */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Học sinh')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn,
                                !isTeacher && styles.tabBtnActive,
                                studentTabStyle,
                                !isTeacher && { borderColor: accentColor },
                            ]}>
                                <FontAwesome5 name="user-graduate" size={13}
                                    color={!isTeacher ? '#3B5BDB' : '#A0AEC0'} style={{ marginBottom: 3 }} />
                                <Text style={[styles.tabText, !isTeacher && styles.tabTextActiveBlue]}>Học sinh</Text>
                            </Animated.View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Giáo viên')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn,
                                isTeacher && styles.tabBtnActive,
                                teacherTabStyle,
                                isTeacher && { borderColor: accentColor },
                            ]}>
                                <FontAwesome5 name="chalkboard-teacher" size={13}
                                    color={isTeacher ? '#F57C00' : '#A0AEC0'} style={{ marginBottom: 3 }} />
                                <Text style={[styles.tabText, isTeacher && styles.tabTextActiveOrange]}>Giáo viên</Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* Firebase error banner */}
                    {firebaseError ? (
                        <View style={styles.errorBanner}>
                            <Feather name="alert-circle" size={14} color="#E53935" />
                            <Text style={styles.errorBannerText}>{firebaseError}</Text>
                        </View>
                    ) : null}

                    {/* ── Input HỌ VÀ TÊN ── */}
                    {renderInput({
                        label: 'HỌ VÀ TÊN',
                        iconName: 'user',
                        value: fullName,
                        onChangeText: (t) => {
                            setFullName(sanitize(t));
                            if (touched.fullName) validate();
                        },
                        onBlur: () => { setTouched(p => ({ ...p, fullName: true })); validate(); },
                        placeholder: 'Nguyễn Văn A',
                        shakeAnim: shakeFullName,
                        errorKey: 'fullName',
                    })}

                    {/* ── Input EMAIL ── */}
                    {renderInput({
                        label: 'EMAIL',
                        iconName: 'mail',
                        value: email,
                        onChangeText: (t) => {
                            setEmail(t); setFirebaseError('');
                            if (touched.email) validate();
                        },
                        onBlur: () => { setTouched(p => ({ ...p, email: true })); validate(); },
                        placeholder: 'example@atoza.vn',
                        keyboardType: 'email-address',
                        autoCapitalize: 'none',
                        shakeAnim: shakeEmail,
                        errorKey: 'email',
                    })}

                    {/* ── Input MẬT KHẨU ── */}
                    {renderInput({
                        label: 'MẬT KHẨU',
                        iconName: 'lock',
                        value: password,
                        onChangeText: (t) => { setPassword(t); if (touched.password) validate(); },
                        onBlur: () => { setTouched(p => ({ ...p, password: true })); validate(); },
                        placeholder: '••••••••',
                        secureTextEntry: !showPassword,
                        shakeAnim: shakePassword,
                        errorKey: 'password',
                        rightElement: (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#A0AEC0" />
                            </TouchableOpacity>
                        ),
                    })}

                    {/* ── Input NHẬP LẠI MẬT KHẨU ── */}
                    {renderInput({
                        label: 'NHẬP LẠI MẬT KHẨU',
                        iconName: 'lock',
                        value: confirmPassword,
                        onChangeText: (t) => { setConfirmPassword(t); if (touched.confirmPassword) validate(); },
                        onBlur: () => { setTouched(p => ({ ...p, confirmPassword: true })); validate(); },
                        placeholder: '••••••••',
                        secureTextEntry: !showPassword,
                        shakeAnim: shakeConfirmPw,
                        errorKey: 'confirmPassword',
                    })}

                    {/* ── Nút Đăng ký ── */}
                    <TouchableOpacity onPress={handleRegister} activeOpacity={0.85}
                        disabled={loading} style={{ marginTop: 8, marginBottom: 28 }}>
                        <LinearGradient
                            colors={registerGradientColors}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.loginBtn}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <View style={styles.loginIconLeft}>
                                        <Feather name="user-plus" size={16} color="rgba(255,255,255,0.85)" />
                                    </View>
                                    <Text style={styles.loginBtnText}>Tạo tài khoản</Text>
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
                    <Text style={styles.registerHint}>Bạn đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.registerLink, { color: accentColor }]}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 48 },
    bgCircleLarge: {
        position: 'absolute', top: -60, right: -80,
        width: 300, height: 300, borderRadius: 150,
    },

    // Brand
    brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 },
    logoBox: {
        width: 46, height: 46, borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5,
    },
    logoImage: { width: 30, height: 30 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#1A202C', letterSpacing: 0.3 },
    roleHint: { fontSize: 11, fontWeight: '600', marginTop: 2 },

    // Screen badge
    screenBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        alignSelf: 'center',
        borderRadius: 20, borderWidth: 1,
        paddingHorizontal: 12, paddingVertical: 5,
        marginBottom: 12,
    },
    screenBadgeText: { fontSize: 12, fontWeight: '700' },

    // Card
    contentCard: {
        borderRadius: 24, paddingHorizontal: 22, paddingVertical: 28,
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1, shadowRadius: 16, elevation: 5, marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 13, color: '#718096', lineHeight: 20, marginBottom: 24, textAlign: 'center' },

    // Tab
    tabRow: {
        flexDirection: 'row', backgroundColor: '#F0F2F8',
        borderRadius: 16, padding: 5, marginBottom: 24, gap: 4,
    },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    tabBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 6,
        borderWidth: 1.5,
    },
    tabText: { fontSize: 13, fontWeight: '600', color: '#A0AEC0' },
    tabTextActiveBlue: { color: '#3B5BDB' },
    tabTextActiveOrange: { color: '#F57C00' },

    // Error banner
    errorBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#FFEBEE', borderRadius: 10,
        paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14,
    },
    errorBannerText: { color: '#E53935', fontSize: 12, fontWeight: '600', flex: 1 },

    // Input
    label: { fontSize: 11, fontWeight: '700', color: '#718096', letterSpacing: 1, marginBottom: 8 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FC', borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 13,
        marginBottom: 14, borderWidth: 1.5,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 14, color: '#1A202C' },
    errorText: { color: '#E53935', fontSize: 11, marginTop: -10, marginBottom: 10, marginLeft: 4 },

    // Button
    loginBtn: {
        borderRadius: 50, paddingVertical: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#3B5BDB', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
        position: 'relative', minHeight: 54,
    },
    loginIconLeft: { position: 'absolute', left: 22 },
    loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
    loginIconRight: { position: 'absolute', right: 22 },

    // Divider
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E8ECF4' },
    dividerText: { fontSize: 10, fontWeight: '700', color: '#A0AEC0', letterSpacing: 1, marginHorizontal: 10 },

    // Social
    socialRow: { flexDirection: 'row', gap: 12 },
    socialPill: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#FFFFFF',
        borderRadius: 50, paddingVertical: 13, gap: 8,
        borderWidth: 1.5, borderColor: '#E8ECF4',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    socialPillText: { fontSize: 13, fontWeight: '700', color: '#2D3748' },
    socialPillLoading: { opacity: 0.6 },

    // Footer
    registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    registerHint: { fontSize: 11, color: '#718096' },
    registerLink: { fontSize: 11, fontWeight: '700' },
});