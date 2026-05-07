// screens/Login.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions,
    Image, Animated, ActivityIndicator, Modal, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

//  Import AsyncStorage để lưu session Role Admin
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Context ──
// UserContext: lưu thông tin user đang đăng nhập (tên, role)
import { UserContext } from '../context/UserContext';
// ConfigContext: lưu cấu hình hệ thống đọc từ Firestore (đã tạo ở bước 1)
import { ConfigContext } from '../context/ConfigContext';

// ── Firebase ──
// auth, db: đã khởi tạo sẵn trong firebaseConfig.js, không cần gọi getAuth() lại
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

// ── Social Auth Hook ──
// useSocialAuth: hook xử lý đăng nhập Google/Phone, nằm ở hooks/useSocialAuth.js
import { useSocialAuth } from '../hooks/useSocialAuth';

const { width } = Dimensions.get('window');

const BG_DOTS = [
    { top: 60, left: 30, size: 120, opacity: 0.06 },
    { top: 200, left: width - 80, size: 80, opacity: 0.08 },
    { top: 380, left: 10, size: 60, opacity: 0.05 },
    { top: 500, left: width - 50, size: 100, opacity: 0.07 },
];

export default function Login({ navigation }) {
    // ── UserContext: để ghi tên và role sau khi login thành công ──
    const { setUserName, setUserRole } = useContext(UserContext);

    // ── ConfigContext: đọc cấu hình hệ thống từ Firestore ──
    // App.js đã đọc Firestore và lưu vào đây — Login chỉ việc dùng
    const config = useContext(ConfigContext);

    // ── State UI ──
    const [activeRole, setActiveRole] = useState('Học sinh');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firebaseError, setFirebaseError] = useState('');
    const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
    const [adminKey, setAdminKey] = useState('');
    const [adminKeyError, setAdminKeyError] = useState('');

    //  đếm số lần đăng nhập thất bại → dùng cho secMaxFailedLogins
    const [failCount, setFailCount] = useState(0);
    // khóa form khi vượt quá số lần cho phép
    const [isLocked, setIsLocked] = useState(false);

    // ── Social Auth ──
    const { handleGoogle, handleFacebook, socialLoading, socialError, setSocialError } = useSocialAuth({
        setUserName, setUserRole, navigation, activeRole
    });

    // ── Validate state ──
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({ email: false, password: false });

    // ── Animation refs ──
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

    // ─────────────────────────────────────────────
    //  validate()
    // Trước: password.length < 6  (hardcode cứng)
    // Sau:   đọc secMinPasswordLength từ bảng Appconfigs trên firebase 
    // ─────────────────────────────────────────────
    const validate = () => {
        let newErrors = { email: '', password: '' };

        if (!email)
            newErrors.email = 'Email không được để trống';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            newErrors.email = 'Email không hợp lệ';

        //  thay số 6 hardcode → đọc từ config (parseInt để chuyển string "8" → số 8)
        const minLen = parseInt(config.secMinPasswordLength, 10) || 6;
        if (!password)
            newErrors.password = 'Mật khẩu không được để trống';
        else if (password.length < minLen)
            newErrors.password = `Mật khẩu tối thiểu ${minLen} ký tự`;

        setErrors(newErrors);
        return newErrors;
    };

    // ─────────────────────────────────────────────
    // parseFirebaseError()
    //  case 'auth/network-request-failed' hiển thị message khác nhau
    // tùy theo secBlockUnknownIP trong config
    // ─────────────────────────────────────────────
    const parseFirebaseError = (code) => {
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Email hoặc mật khẩu không đúng';
            case 'auth/too-many-requests':
                return 'Quá nhiều lần thử, vui lòng thử lại sau';
            case 'auth/network-request-failed':
                // nếu admin bật secBlockUnknownIP → hiện message cụ thể hơn
                return config.secBlockUnknownIP
                    ? 'Kết nối bị từ chối — thiết bị không được nhận dạng'
                    : 'Lỗi kết nối mạng';
            default:
                return 'Đăng nhập thất bại, vui lòng thử lại';
        }
    };

    // ─────────────────────────────────────────────
    // handleLogin()
    //  đếm failCount → khóa form khi >= secMaxFailedLogins
    //  check requirePasswordChange sau login thành công
    // ─────────────────────────────────────────────
    const handleLogin = async () => {
        // Không cho login nếu form đang bị khóa
        if (isLocked) return;

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

            // Bước 2: Đọc thông tin user từ Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            let role = activeRole;
            let fullName = email;
            if (userDoc.exists()) {
                role = userDoc.data().role || activeRole;
                fullName = userDoc.data().fullName || email;
            }

            // Bước 3: Reset failCount vì đã login thành công
            setFailCount(0);
            setIsLocked(false);

            setUserName(fullName);
            setUserRole(role);

            //  check requirePasswordChange
            // Field này được set true bởi flow Quên mật khẩu
            // Nếu true → bắt buộc đổi mật khẩu trước khi vào app
            const mustChange = userDoc.exists()
                ? (userDoc.data().requirePasswordChange || false)
                : false;

            if (mustChange) {
                // Navigate sang màn đổi mật khẩu, truyền uid để màn đó biết cần update ai
                navigation.navigate('ChangePassword', { uid, isRequired: true });
                return;
            }

            // Bước 4: Điều hướng bình thường theo role
            if (role === 'Giáo viên' || role === 'Admin') {
                navigation.navigate('MainTabsAdmin');
            } else {
                navigation.navigate('MainTabs');
            }

        } catch (error) {
            //  đếm số lần thất bại
            const maxFail = parseInt(config.secMaxFailedLogins, 10) || 5;
            const newCount = failCount + 1;
            setFailCount(newCount);

            if (newCount >= maxFail) {
                // Vượt ngưỡng → khóa form
                setIsLocked(true);
                setFirebaseError(
                    `Tài khoản tạm khóa sau ${maxFail} lần thất bại liên tiếp. Vui lòng thử lại sau.`
                );
            } else {
                // Chưa đến ngưỡng → hiện đếm còn lại
                setFirebaseError(
                    `${parseFirebaseError(error.code)} (${newCount}/${maxFail})`
                );
            }

            triggerShake(shakeEmail);
            triggerShake(shakePassword);
        } finally {
            setLoading(false);
        }
    };

    // Admin ẩn: giữ logo 3 giây
    const handleLogoPressIn = () => {
        Animated.spring(logoScale, { toValue: 0.85, useNativeDriver: true }).start();
        logoTimer.current = setTimeout(() => {
            Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }).start();
            //  Thay vì vào thẳng Admin, mở Modal yêu cầu khóa bảo mật
            setIsAdminModalVisible(true);
            setAdminKey('');
            setAdminKeyError('');
        }, 3000);
    };

    const handleLogoPressOut = () => {
        if (logoTimer.current) { clearTimeout(logoTimer.current); logoTimer.current = null; }
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }).start();
    };

    // Hàm xử lý kiểm tra mã bí mật của Admin
    const verifyAdminKeyAndLogin = async () => {
        // Khóa bảo mật siêu mạnh tối thiểu 15 ký tự (2 mã này là giống nhau)
        //bản mã secret key hardcode là để thuận tiện cho việc debug trước khi deploy dự án
        const SECRET_ADMIN_KEY = config.adminSecretKey||"Atoza@AdminSuperKey2026";

        if (adminKey.length < 15) {
            setAdminKeyError('Khóa bảo mật phải có ít nhất 15 ký tự.');
            return;
        }

        if (adminKey === SECRET_ADMIN_KEY) {
            setIsAdminModalVisible(false);
            // Ghi nhận session Admin để App.js không chặn Auto-login
            await AsyncStorage.setItem('pending_login_role', 'Admin');
            setUserName('Quản trị viên (Bù nhìn)');
            setUserRole('Admin');
            navigation.navigate('MainTabsAdmin');
        } else {
            setAdminKeyError('Khóa bảo mật không chính xác. Quyền truy cập bị từ chối!');
        }
    };

    // hàm xử lý quên mật khẩu, khôi phục mật khẩu
    const showAlert = (message) => {
        if (Platform.OS === 'web') {
            // alert mặc định của trình duyệt
            window.alert(message);
        } else {
            // Alert native cho iOS / Android
            Alert.alert('Thông báo', message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            showAlert('Vui lòng nhập địa chỉ email của bạn vào ô đăng nhập trước.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email.trim());
            showAlert(
                'Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (cả mục Spam).'
            );
        } catch (error) {
            console.error('Lỗi gửi email reset:', error.code);

            switch (error.code) {
                case 'auth/user-not-found':
                    showAlert('Email này chưa được đăng ký trong hệ thống.');
                    break;
                case 'auth/invalid-email':
                    showAlert('Địa chỉ email không hợp lệ.');
                    break;
                case 'auth/too-many-requests':
                    showAlert('Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút.');
                    break;
                default:
                    showAlert('Có lỗi xảy ra: ' + error.message);
            }
        }
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
                {/* ── Logo + Brand ── */}
                <View style={styles.brandRow}>
                    <TouchableOpacity
                        onPressIn={handleLogoPressIn}
                        onPressOut={handleLogoPressOut}
                        activeOpacity={1}
                    >
                        <Animated.View style={[
                            styles.logoBox,
                            { borderColor: dotColor, transform: [{ scale: logoScale }] }
                        ]}>
                            <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                        </Animated.View>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.brandName}>Atoza</Text>
                        <Animated.Text style={[styles.roleHint, { color: dotColor }]}>
                            Đăng nhập DƯỚI DẠNG ROLE: {isTeacher ? 'Giáo viên' : 'Học sinh'}
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
                        <View style={[
                            styles.errorBanner,
                            // đổi màu banner thành cam đậm khi form bị khóa
                            isLocked && { backgroundColor: '#FFF3E0', borderColor: '#F57C00', borderWidth: 1 }
                        ]}>
                            <Feather
                                name={isLocked ? 'lock' : 'alert-circle'}
                                size={14}
                                color={isLocked ? '#F57C00' : '#E53935'}
                            />
                            <Text style={[
                                styles.errorBannerText,
                                isLocked && { color: '#F57C00' }
                            ]}>
                                {firebaseError}
                            </Text>
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
                            //  disable input khi form bị khóa
                            editable={!isLocked}
                        />
                    </Animated.View>
                    {touched.email && errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                    {/* ── Mật khẩu ── */}
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>MẬT KHẨU</Text>
                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={{ alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 }}
                        >
                            <Text style={{ color: '#3B5BDB', fontWeight: '600' }}>Quên mật khẩu?</Text>
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
                            editable={!isLocked}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color="#A0AEC0" />
                        </TouchableOpacity>
                    </Animated.View>
                    {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    {/* ── Nút Đăng nhập ── */}
                    {/* Chức năng gắn cờ khóa đăng nhập tạm thời: thêm isLocked vào disabled */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        activeOpacity={0.85}
                        disabled={loading || isLocked}
                        style={{ marginTop: 8, marginBottom: 28 }}
                    >
                        <LinearGradient
                            colors={isLocked ? ['#CBD5E0', '#A0AEC0'] : loginGradient}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.loginBtn}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <View style={styles.loginIconLeft}>
                                        <FontAwesome5
                                            name={isLocked ? 'lock' : (isTeacher ? 'chalkboard-teacher' : 'user-graduate')}
                                            size={16} color="rgba(255,255,255,0.85)" />
                                    </View>
                                    <Text style={styles.loginBtnText}>
                                        {isLocked ? 'Tài khoản tạm khóa' : 'Đăng nhập'}
                                    </Text>
                                    {!isLocked && (
                                        <View style={styles.loginIconRight}>
                                            <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.85)" />
                                        </View>
                                    )}
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

                    {/* Social error banner */}
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
                            activeOpacity={0.8} onPress={handleGoogle} disabled={!!socialLoading || isLocked}
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
                            activeOpacity={0.8} onPress={handleFacebook} disabled={!!socialLoading || isLocked}
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
                <Text style={styles.adminHint}>Giữ logo ATOZA 3 giây để vào Admin</Text>
            </ScrollView>

            {/* ──  MODAL ẨN DÀNH CHO ADMIN ── */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isAdminModalVisible}
                onRequestClose={() => setIsAdminModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={{ alignItems: 'center', marginBottom: 15 }}>
                            <Feather name="shield" size={40} color="#E53E3E" />
                        </View>
                        <Text style={styles.modalTitle}>Xác Thực Phân Quyền</Text>
                        <Text style={styles.modalSubtitle}>
                            Khu vực dành riêng cho Quản trị viên. Yêu cầu nhập khóa bảo mật cấp cao (Tối thiểu 15 ký tự).
                        </Text>

                        <TextInput
                            style={[styles.modalInput, adminKeyError ? { borderColor: '#E53E3E' } : null]}
                            placeholder="Nhập khóa bảo mật..."
                            placeholderTextColor="#A0AEC0"
                            secureTextEntry
                            autoCapitalize="none"
                            value={adminKey}
                            onChangeText={(text) => {
                                setAdminKey(text);
                                setAdminKeyError(''); // Xóa lỗi khi gõ phím
                            }}
                        />

                        {/* Hiện thông báo lỗi nếu nhập sai */}
                        {adminKeyError ? <Text style={styles.errorTextModal}>{adminKeyError}</Text> : null}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                                onPress={() => setIsAdminModalVisible(false)}
                            >
                                <Text style={styles.modalBtnCancelText}>Hủy Bỏ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnSubmit]}
                                onPress={verifyAdminKeyAndLogin}
                            >
                                <Text style={styles.modalBtnSubmitText}>Truy Cập</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    adminHint: { textAlign: 'center', fontSize: 9, color: '#7373a8', marginTop: 4, opacity: 0.8 },

    // ──  CSS CHO MODAL ADMIN ──
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center', alignItems: 'center'
    },
    modalContent: {
        width: '85%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 15
    },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C', marginBottom: 8, textAlign: 'center' },
    modalSubtitle: { fontSize: 13, color: '#718096', marginBottom: 20, textAlign: 'center', lineHeight: 20 },
    modalInput: {
        backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1E293B', marginBottom: 8
    },
    errorTextModal: { color: '#E53E3E', fontSize: 12, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 },
    modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    modalBtnCancel: { backgroundColor: '#F1F5F9' },
    modalBtnSubmit: { backgroundColor: '#E53E3E' },
    modalBtnCancelText: { color: '#64748B', fontWeight: '700', fontSize: 15 },
    modalBtnSubmitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});