import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert, Image, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

// ── Các chấm trang trí nền ──
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
    const { setUserName, setUserRole } = useContext(UserContext);
    //State dành cho validate
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: activeRole === 'Học sinh' ? 0 : 1,
            speed: 14,
            bounciness: 6,
            useNativeDriver: false,
        }).start();
    }, [activeRole]);

    const isTeacher = activeRole === 'Giáo viên';

    // ── Màu gradient nền ngoài theo role ──
    const bgColors = isTeacher
        ? ['#FFF9F0', '#FFF4E0', '#FFF0D0']
        : ['#EEF2FF', '#E8EFFE', '#DCE4FD'];

    // ── Màu accent theo role ──
    const accentColor = isTeacher ? '#F57C00' : '#3B5BDB';
    // style động cho border tab Học sinh
    const studentBorderStyle = !isTeacher
        ? { borderColor: accentColor }  // comment: khi Học sinh active, border dùng accentColor
        : {};

    // style động cho border tab Giáo viên
    const teacherBorderStyle = isTeacher
        ? { borderColor: accentColor }  // comment: khi Giáo viên active, border dùng accentColor
        : {};
    // ── Gradient nút login ──
    const loginGradientColors = isTeacher
        ? ['#FFB74D', '#F57C00']
        : ['#4C6EF5', '#3B5BDB'];
    //Animation shake input khi sai validate
    const shakeEmail = useRef(new Animated.Value(0)).current;
    const shakePassword = useRef(new Animated.Value(0)).current;
    //Hàm shake tiêu chuẩn
    const triggerShake = (animatedValue) => {
        Animated.sequence([
            Animated.timing(animatedValue, { toValue: 10, duration: 40, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: -10, duration: 40, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: -6, duration: 40, useNativeDriver: true }),
            Animated.timing(animatedValue, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    };
    // ── Background card animate ──
    const cardBgColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFFFFF', '#FFFDF7'],
    });

    // ── Màu chấm trang trí nền ──
    const dotColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3B5BDB', '#F57C00'],
    });
    //Hàm validate và chuyển Screen trang chủ dựa theo Role
    // const handleLogin = () => {
    //     if (!email || !password) {
    //         Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
    //         return;
    //     }
    //     setUserName(email);
    //     setUserRole(isTeacher ? 'giảng viên' : 'thí sinh');
    //     navigation.navigate(isTeacher ? 'MainTabsAdmin' : 'MainTabs');
    // };
    const handleLogin = () => {
        setTouched({ email: true, password: true });

        const validation = validate();

        if (validation.email) triggerShake(shakeEmail);
        if (validation.password) triggerShake(shakePassword);

        if (validation.email || validation.password) return;

        setUserName(email);
        setUserRole(isTeacher ? 'giảng viên' : 'thí sinh');
        navigation.navigate(isTeacher ? 'MainTabsAdmin' : 'MainTabs');
    };

    const handleHiddenAdmin = () => {
        setUserName('Admin');
        setUserRole('Admin');
        navigation.navigate('MainTabsAdmin');
    };

    // ── Animated styles cho tab ──
    const studentTabStyle = {
        transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1.02, 1] }) }],
        elevation: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [3, 0] }),
    };
    const teacherTabStyle = {
        transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }],
        elevation: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
    };
    //Hàm Validate 
    const validate = () => {
        let newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
        }

        setErrors(newErrors);

        return newErrors; // trả về object luôn
    };

    //Giao diện chính
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            {/* ── Nền gradient đổi màu theo role ── */}
            <LinearGradient colors={bgColors} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>

                {/* ── Các vòng trang trí nền ── */}
                {BG_DOTS.map((dot, i) => (
                    <Animated.View
                        key={i}
                        style={{
                            position: 'absolute',
                            top: dot.top,
                            left: dot.left,
                            width: dot.size,
                            height: dot.size,
                            borderRadius: dot.size / 2,
                            backgroundColor: dotColor,
                            opacity: dot.opacity,
                        }}
                    />
                ))}

                {/* ── Vòng lớn góc trên phải ── */}
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
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <Text style={styles.brandName}>Atoza</Text>
                </View>

                {/* ── Card chính ── */}
                <Animated.View style={[styles.contentCard, { backgroundColor: cardBgColor }]}>

                    <Text style={styles.title}>Đăng nhập</Text>
                    <Text style={styles.subtitle}>
                        Vui lòng nhập thông tin để truy cập vào tài khoản của bạn.
                    </Text>

                    {/* ── Tab Role ── */}
                    <View style={styles.tabRow}>
                        {/* Học sinh */}
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Học sinh')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn,
                                !isTeacher && styles.tabBtnActive,
                                studentTabStyle,
                                studentBorderStyle,
                            ]}>
                                <FontAwesome5
                                    name="user-graduate"
                                    size={13}
                                    color={!isTeacher ? '#3B5BDB' : '#A0AEC0'}
                                    style={{ marginBottom: 3 }}
                                />
                                <Text style={[styles.tabText, !isTeacher && styles.tabTextActiveBlue]}>
                                    Học sinh
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>

                        {/* Giáo viên */}
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setActiveRole('Giáo viên')} activeOpacity={0.8}>
                            <Animated.View style={[
                                styles.tabBtn,
                                isTeacher && styles.tabBtnActive,
                                teacherTabStyle,
                                teacherBorderStyle,
                            ]}>
                                <FontAwesome5
                                    name="chalkboard-teacher"
                                    size={13}
                                    color={isTeacher ? '#F57C00' : '#A0AEC0'}
                                    style={{ marginBottom: 3 }}
                                />
                                <Text style={[styles.tabText, isTeacher && styles.tabTextActiveOrange]}>
                                    Giáo viên
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* ── Input EMAIL ── */}
                    <Text style={styles.label}>EMAIL</Text>
                    <Animated.View
                        style={[
                            styles.inputBox,
                            {
                                transform: [{ translateX: shakeEmail }],
                                borderColor: errors.email && touched.email
                                    ? '#E53935'
                                    : email
                                        ? accentColor + '55'
                                        : '#E8ECF4'
                            }
                        ]}
                    >
                        <Feather name="mail" size={18} color={email ? accentColor : '#A0AEC0'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="example@atoza.vn"
                            placeholderTextColor="#C0C9D8"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (touched.email) validate();
                            }}
                            onBlur={() => {
                                setTouched(prev => ({ ...prev, email: true }));
                                validate();
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Animated.View>
                    {touched.email && errors.email ? (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}

                    {/* ── Input MẬT KHẨU ── */}
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>MẬT KHẨU</Text>
                        <TouchableOpacity>
                            <Text style={[styles.forgotText, { color: accentColor }]}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>
                    <Animated.View
                        style={[
                            styles.inputBox,
                            {
                                transform: [{ translateX: shakePassword }],
                                borderColor: errors.password && touched.password
                                    ? '#E53935'
                                    : password
                                        ? accentColor + '55'
                                        : '#E8ECF4'
                            }
                        ]}
                    >
                    <Feather name="lock" size={18} color={password ? accentColor : '#A0AEC0'} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#C0C9D8"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (touched.password) validate();
                        }}
                        onBlur={() => {
                            setTouched(prev => ({ ...prev, password: true }));
                            validate();
                        }}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#A0AEC0" />
                    </TouchableOpacity>
                </Animated.View>
                {touched.password && errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                {/* ── Nút Đăng nhập với Icon ── */}
                <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} style={{ marginTop: 8, marginBottom: 28 }}>
                    <LinearGradient
                        colors={loginGradientColors}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.loginBtn}
                    >
                        {/* Icon trái theo role */}
                        <View style={styles.loginIconLeft}>
                            <FontAwesome5
                                name={isTeacher ? 'chalkboard-teacher' : 'user-graduate'}
                                size={16}
                                color="rgba(255,255,255,0.85)"
                            />
                        </View>

                        <Text style={styles.loginBtnText}>Đăng nhập</Text>

                        {/* Mũi tên phải */}
                        <View style={styles.loginIconRight}>
                            <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.85)" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* ── Divider ── */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* ── Social Login ── */}
                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialPill} activeOpacity={0.8}>
                        <FontAwesome5 name="google" size={17} color="#EA4335" solid />
                        <Text style={styles.socialPillText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialPill} activeOpacity={0.8}>
                        <FontAwesome5 name="facebook" size={17} color="#1877F2" solid />
                        <Text style={styles.socialPillText}>Facebook</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <TouchableOpacity style={styles.hiddenAdmin} onPress={handleHiddenAdmin} activeOpacity={1}>
                <Text
                    style={{
                        color: '#1A202C',   // màu chữ tối, dễ đọc
                        fontSize: 10,       // to hơn 1 chút
                        fontWeight: '600',  // đậm nhẹ
                        textAlign: 'center',
                        alignItems: 'center',
                    }}
                >
                    Admin                      {/* thay ký tự · bằng chữ Admin */}
                </Text>
            </TouchableOpacity>
            {/* ── Đăng ký + Admin ẩn ── */}
            <View style={styles.registerRow}>
                <Text style={styles.registerHint}>Bạn mới biết đến Educa? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={[styles.registerLink, { color: accentColor }]}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1, },
    scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 48 },

    // Vòng nền lớn
    bgCircleLarge: {
        position: 'absolute',
        top: -60,
        right: -80,
        width: 300,
        height: 300,
        borderRadius: 150,
    },

    // Brand
    brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
    logoBox: {
        width: 46, height: 46, borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 10, borderWidth: 1.5,
    },
    logoImage: { width: 30, height: 30 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#1A202C', letterSpacing: 0.3 },

    // Card
    contentCard: {
        borderRadius: 24,
        paddingHorizontal: 22,
        paddingVertical: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
        marginBottom: 24,
    },

    // Title
    title: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 6, textAlign: 'center', letterSpacing: -0.3 },
    subtitle: { fontSize: 13, color: '#718096', lineHeight: 20, marginBottom: 24, textAlign: 'center' },

    // Tab
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#F0F2F8',
        borderRadius: 16,
        padding: 5,
        marginBottom: 24,
        gap: 4,
    },
    tabBtn: {
        flex: 1, paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    tabBtnActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        borderWidth: 1.5,        // comment: border chỉ áp cho tab active
        borderColor: '#3B5BDB',  // comment: màu border mặc định cho Học sinh
    },
    tabText: { fontSize: 13, fontWeight: '600', color: '#A0AEC0' },
    tabTextActiveBlue: { color: '#3B5BDB' },
    tabTextActiveOrange: { color: '#F57C00' },

    // Input
    label: { fontSize: 11, fontWeight: '700', color: '#718096', letterSpacing: 1, marginBottom: 8 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 8 },
    forgotText: { fontSize: 12, fontWeight: '700' },
    inputBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FC',
        borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 13,
        marginBottom: 14,
        borderWidth: 1.5,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 14, color: '#1A202C' },

    // Login Button
    loginBtn: {
        borderRadius: 50,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
        position: 'relative',
    },
    loginIconLeft: {
        position: 'absolute',
        left: 22,
    },
    loginBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
    loginIconRight: {
        position: 'absolute',
        right: 22,
    },

    // Divider
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#E8ECF4' },
    dividerText: { fontSize: 10, fontWeight: '700', color: '#A0AEC0', letterSpacing: 1, marginHorizontal: 10 },

    // Social
    socialRow: { flexDirection: 'row', gap: 12 },
    socialPill: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50, paddingVertical: 13, gap: 8,
        borderWidth: 1.5, borderColor: '#E8ECF4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    socialPillText: { fontSize: 13, fontWeight: '700', color: '#2D3748' },

    // Register
    registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    registerHint: { fontSize: 11, color: '#718096', paddingBottom: 60, },
    registerLink: { fontSize: 11, fontWeight: '700', paddingBottom: 60, },
    hiddenAdmin: {
        padding: 8,
        // thêm các dòng sau để nhìn thấy nút
        borderRadius: 12,               // bo tròn nút
        backgroundColor: '#CBD5F5',     // nền xanh nhạt để dễ thấy
        marginLeft: 8,                  // cách chữ "Đăng ký ngay" một chút
    },
    errorText: {
        color: '#E53935',
        fontSize: 11,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 4,
    }
});