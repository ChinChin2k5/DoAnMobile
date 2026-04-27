import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert, Image, Animated
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ── 1. KHAI BÁO CÁC CHẤM NỀN (Dùng để chuyển màu) ──
const BG_DOTS = [
    { top: -40, left: -40, size: 200 },
    { top: height * 0.3, left: width - 80, size: 120 },
    { top: height * 0.6, left: -50, size: 150 },
    { top: height * 0.85, left: width - 100, size: 180 },
];

export default function Register({ navigation }) {
    const [activeRole, setActiveRole] = useState('Học sinh');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});//state cho validation

    //  LOGIC ANIMATED CHUẨN (Khóa chuyển màu) 
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: activeRole === 'Học sinh' ? 0 : 1,
            duration: 500, // Tốc độ chuyển màu mượt mà
            useNativeDriver: false, // Phải để false để nội suy màu sắc (color interpolation)
        }).start();
    }, [activeRole]);

    const isTeacher = activeRole === 'Giảng viên';

    // ── Màu accent theo role (giống Login) ──
    // Học sinh: xanh dương, Giảng viên: cam
    const accentColor = isTeacher ? '#F57C00' : '#3B5BDB';

    // Nội suy màu chủ đạo (Primary Theme Color)
    // 0: Học sinh (xanh), 1: Giảng viên (cam)
    const themeColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#3B5BDB', '#F57C00'],
    });

    // Nội suy màu nền nhạt (Light Theme Background) dùng cho border input
    const lightThemeColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#EEF2FF', '#FFF4E0'], // xanh nhạt -> cam nhạt
    });

    // đảm bảo trong mọi trường hợp KHÔNG tạo tài khoản Admin
    const handleRegister = () => {
        if (!validate()) return;

        if (activeRole === 'Admin') {
            Alert.alert('Không hỗ trợ', 'Admin không được phép đăng ký.');
            return;
        }

        Alert.alert('Thành công', `Đã tạo tài khoản ${activeRole}`);
        navigation.navigate('Login');
    };
    //Hàm Validate ô nhập liệu
    const validate = () => {
        let newErrors = {};

        // FULL NAME
        //2-50 ký tự, không chứa ký tự đặc biệt nguy hiểm, không toàn là số
        if (!fullName.trim()) {
            newErrors.fullName = 'Không được để trống';
        } else if (fullName.length < 2 || fullName.length > 50) {
            newErrors.fullName = 'Tên phải từ 2–50 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
            newErrors.fullName = 'Tên không hợp lệ';
        }

        // EMAIL
        //Không dùng uppcase, không space, không dùng dấu và ký tự lạ ngoài bảng chữ cái ABC tiếng anh
        const emailRegex =
            /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+\.[a-z]{2,}$/;

        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else if (!emailRegex.test(email.toLowerCase())) {
            newErrors.email = 'Email không hợp lệ';
        }

        // PASSWORD
        //>=8 ký tự, có chữ hóa, có chữ thường, có chữ số, có ký tự đặc biệt
        if (!password) {
            newErrors.password = 'Không được để trống';
        } else if (password.length < 8) {
            newErrors.password = 'Ít nhất 8 ký tự';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Cần chữ hoa';
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = 'Cần chữ thường';
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = 'Cần số';
        } else if (!/[!@#$%^&*]/.test(password)) {
            newErrors.password = 'Cần ký tự đặc biệt';
        }

        // CONFIRM PASSWORD
        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Không khớp mật khẩu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    //Hàm chống input bẩn (security), trống inject <script>
    const sanitize = (text) => text.replace(/[<>]/g, '');
    //Hàm vô hiệu hóa nút khi chưa hợp lệ
    const isValid = Object.keys(errors).length === 0 &&
    fullName && email && password && confirmPassword;
    
    return (
        <View style={styles.container}>
            {/* 3. CÁC CHẤM NỀN BIẾN ĐỔI MÀU THEO ROLE */}
            {BG_DOTS.map((dot, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bgDot,
                        {
                            top: dot.top,
                            left: dot.left,
                            width: dot.size,
                            height: dot.size,
                            borderRadius: dot.size / 2,
                            backgroundColor: themeColor, // Xanh -> Cam như Login
                            opacity: 0.06,
                        },
                    ]}
                />
            ))}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* LOGO + TÊN THƯƠNG HIỆU */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoRow}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.logoImg}
                                resizeMode="contain"
                            />
                            <Text style={styles.logoText}>ATOZA</Text>
                        </View>
                        <Text style={styles.subTitle}>Kiến tạo tương lai số</Text>
                    </View>

                    {/* TABS DẠNG PILL (VIÊN THUỐC) */}
                    <View style={styles.pillTabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.pillTab,
                                activeRole === 'Học sinh' && styles.pillTabActive,
                            ]}
                            onPress={() => setActiveRole('Học sinh')}
                        >
                            <FontAwesome5
                                name="user-graduate"
                                size={13}
                                color={!isTeacher ? '#3B5BDB' : '#A0AEC0'}
                                style={{ marginBottom: 3 }}
                            />
                            <Text
                                style={[
                                    styles.pillTabText,
                                    activeRole === 'Học sinh' && { color: accentColor },
                                ]}
                            >
                                Học sinh
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.pillTab,
                                activeRole === 'Giảng viên' && styles.pillTabActive,
                            ]}
                            onPress={() => setActiveRole('Giảng viên')}
                        >
                            <FontAwesome5
                                name="chalkboard-teacher"
                                size={13}
                                color={isTeacher ? '#F57C00' : '#A0AEC0'}
                                style={{ marginBottom: 3 }}
                            />
                            <Text
                                style={[
                                    styles.pillTabText,
                                    activeRole === 'Giảng viên' && { color: accentColor },
                                ]}
                            >
                                Giảng viên
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 4. CONTENT CARD VỚI BORDER RADIUS 35 CHUẨN */}
                    <View style={styles.contentCard}>
                        <Animated.Text style={[styles.cardTitle, { color: themeColor }]}>
                            Đăng ký ngay
                        </Animated.Text>

                        {/* Input Họ Tên */}

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Họ và tên</Text>
                            <Animated.View
                                style={[
                                    styles.inputPill,
                                    {
                                        borderColor: fullName
                                            ? accentColor + '66'
                                            : lightThemeColor,
                                    },
                                ]}
                            >
                                <Feather
                                    name="user"
                                    size={18}
                                    color={fullName ? accentColor : '#94a3b8'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nguyễn Văn A"
                                    value={fullName}
                                    onChangeText={(text) => {
                                        //chống input bẩn (security) chống inject <script>
                                        setFullName(sanitize(text));
                                        if (errors.fullName) validate();
                                    }}
                                />
                            </Animated.View>
                        </View>
                        {errors.fullName && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                                {errors.fullName}
                            </Text>
                        )}

                        {/* Input Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <Animated.View
                                style={[
                                    styles.inputPill,
                                    {
                                        borderColor: email ? accentColor + '66' : lightThemeColor,
                                    },
                                ]}
                            >
                                <Feather
                                    name="mail"
                                    size={18}
                                    color={email ? accentColor : '#94a3b8'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="atoza@gmail.com"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) validate();
                                    }}
                                />
                            </Animated.View>
                        </View>
                        {errors.email && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                                {errors.email}
                            </Text>
                        )}

                        {/* Input Mật khẩu */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mật khẩu</Text>
                            <Animated.View
                                style={[
                                    styles.inputPill,
                                    {
                                        borderColor: password
                                            ? accentColor + '66'
                                            : lightThemeColor,
                                    },
                                ]}
                            >
                                <Feather
                                    name="lock"
                                    size={18}
                                    color={password ? accentColor : '#94a3b8'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) validate();
                                    }}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Feather
                                        name={showPassword ? 'eye' : 'eye-off'}
                                        size={18}
                                        color="#94a3b8"
                                    />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                        {errors.password && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                                {errors.password}
                            </Text>
                        )}

                        {/* Input Nhập lại mật khẩu */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nhập lại mật khẩu</Text>
                            <Animated.View
                                style={[
                                    styles.inputPill,
                                    {
                                        borderColor: confirmPassword
                                            ? accentColor + '66'
                                            : lightThemeColor,
                                    },
                                ]}
                            >
                                <Feather
                                    name="lock"
                                    size={18}
                                    color={confirmPassword ? accentColor : '#94a3b8'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) validate();
                                    }}
                                />
                            </Animated.View>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>
                                {errors.confirmPassword}
                            </Text>
                        )}

                        {/* 5. NÚT ĐĂNG KÝ CHUYỂN MÀU THEO ROLE (Xanh -> Cam) */}
                        <Animated.View
                            style={{
                                backgroundColor: themeColor,
                                borderRadius: 50,
                                marginTop: 10,
                            }}
                        >
                            <TouchableOpacity
                                style={styles.btnSubmitPill}
                                onPress={handleRegister}
                            >
                                {/* Icon trái theo role */}
                                <View style={styles.loginIconLeft}>
                                    <FontAwesome5
                                        name={isTeacher ? 'chalkboard-teacher' : 'user-graduate'}
                                        size={16}
                                        color="rgba(255,255,255,0.85)"
                                    />
                                </View>
                                <Text style={styles.btnSubmitText}>Tạo tài khoản</Text>
                                <Ionicons
                                    name="arrow-forward-outline"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Animated.Text
                                style={[styles.registerLink, { color: themeColor }]}
                            >
                                Đăng nhập ngay
                            </Animated.Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    bgDot: { position: 'absolute' },
    scrollContent: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40 },

    headerContainer: { alignItems: 'center', marginBottom: 30 },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoImg: { width: 45, height: 45, marginRight: 10 },
    logoText: { fontSize: 32, fontWeight: '900', color: '#1e293b', letterSpacing: 1 },
    subTitle: { color: '#64748b', fontSize: 13, fontWeight: '500' },

    pillTabContainer: {
        flexDirection: 'row',
        backgroundColor: '#e2e8f0',
        borderRadius: 50,
        padding: 5,
        marginBottom: 25,
    },
    pillTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 50,
    },
    pillTabActive: {
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    pillTabText: { fontWeight: '700', color: '#94a3b8' },

    // THẺ CONTENT CARD CHUẨN 35PX
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        padding: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 25,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 25,
        textAlign: 'center',
    },

    inputGroup: { marginBottom: 15 },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 8,
        marginLeft: 10,
    },
    inputPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 50,
        paddingHorizontal: 20,
        borderWidth: 1.5,
    },
    inputIcon: { marginRight: 10 },
    textInput: { flex: 1, paddingVertical: 12, color: '#1e293b' },

    btnSubmitPill: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    btnSubmitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { color: '#64748b',fontSize:11, },
    registerLink: { fontWeight: '800',fontSize:11, },
});