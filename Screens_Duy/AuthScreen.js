import React, { useState, useRef, Children, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    GraduationCap,
    User,
    Lock,
    Mail,
    ShieldCheck,
    ChevronDown,
    Check,
    Briefcase,
    LogIn,
    UserPlus,
    Eye,
    EyeOff
} from 'lucide-react-native';
const { width } = Dimensions.get('window');
// 1. Component Input có Icon, thay đổi Icon và tính năng ẩn/ hiện mật khẩu, báo lỗi đăng nhập
const CustomInput = ({ label, icon: Icon, placeholder, secureTextEntry, value, onChangeText, error }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.formGroup}>
            <Text style={styles.formLabel}>{label}</Text>
            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
                error && styles.inputWrapperError // <-- Thêm viền đỏ nếu có lỗi xác thực đăng nhập
            ]}>
                <Icon
                    color={error ? "#ef4444" : (isFocused ? "#6366f1" : "#9ca3af")}
                    size={18}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={[styles.formInput, secureTextEntry && { paddingRight: 40 }]}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={value} // <-- Nhận giá trị từ cha
                    onChangeText={onChangeText} // <-- Gửi giá trị người dùng gõ về cha
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? (
                            <Eye color="#6366f1" size={18} />
                        ) : (
                            <EyeOff color="#9ca3af" size={18} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {/* Hiển thị dòng chữ lỗi màu đỏ ở dưới cùng
      1. Nếu error = true -> hiện màu chữ đỏ báo lỗi
      2. Nếu error = false -> không hiện gì cả - NULL
      */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};
// 2. TẠO COMPONENT HIỆU ỨNG BOUNCE NẢY LÊN XUỐNG (Cho nút bấm chính)
const BouncingButton = ({ children, style, onPress }) => {
    const bounceValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceValue, {
                    toValue: -5,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flex: 1 }}>
            <Animated.View style={[style, { transform: [{ translateY: bounceValue }] }]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};
export default function AuthScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('login');//login hoac sign-up
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');//student // giang vien
    const [errors, setErrors] = useState({}); // Lưu các lỗi như { email: "Thiếu email", password: "Quá ngắn" }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const rotateAnim = useRef(new Animated.Value(0)).current;
    // Hàm kiểm tra định dạng email hợp lệ
    const validateEmail = (email) => {
        //1. ký hiệu ^ : bắt đầu là string
        //2. [^\s@]+ : ít nhất 1 ký tự ko phải khoảng trắng // @
        //3. ký hiệu @ : phải có ký hiệu @
        //4.[^\s@]+ : đây là phần domain 
        //5. \. : phải có dấu chấm (VD: Duy@gmail.com)
        //6. [^\s@]+ : phần đuôi domain
        //7. $ : kết thúc chuỗi, không lấy khoảng trắng nào nữa

        //kết quả đúng khi: Abc@gmail.com || Abc@yahoo.com...
        //kết quả sai khi: Abc@. || Abc@.com || Abcgmail.com
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Logic xử lý khi bấm Đăng nhập
    const handleLogin = () => {
        let newErrors = {};

        if (!email) {
            newErrors.email = 'Vui lòng nhập tài khoản hoặc email.';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không đúng định dạng.';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu.';
        }
        else if(password.length <6){
            newErrors.password='Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors); // Cập nhật danh sách lỗi ra màn hình

        // Nếu không có lỗi nào (object rỗng) -> Đăng nhập thành công!
        if (Object.keys(newErrors).length === 0) {
            console.log('Call API Đăng nhập với:', { email, password, role: selectedRole });
            navigation.navigate('Home'); // Chuyển trang (Có thể chuyển trang chủ Sinh Viên || Giảng Viên nếu muốn)
        }
    };

    // Logic xử lý khi bấm Đăng ký
    const handleRegister = () => {
        let newErrors = {};

        if (!fullName) newErrors.fullName = 'Vui lòng nhập họ và tên.';

        if (!email) {
            newErrors.email = 'Vui lòng nhập email.';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không đúng định dạng.';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu.';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        }

        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Call API Đăng ký thành công!');
            // Có thể chuyển qua tab login hoặc báo thành công ở đây
        }
    };

    // Mẹo: Xóa hết lỗi và form khi chuyển đổi giữa Tab Đăng nhập / Đăng ký
    const switchTab = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setEmail('');
        setPassword('');
        setFullName('');
        setConfirmPassword('');
    };

    // Dùng useEffect để lắng nghe khi biến showRoleDropdown thay đổi
    //nếu "showRoleDropdown" thay đổi "State" --> useEffect của hàm "rotateAnim" bắt đầu Animation của nó
    // thời gian Animation bắt đầu từ 0->1 trong 200ms
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: showRoleDropdown ? 1 : 0,
            duration: 200, // Tốc độ xoay (200ms)
            useNativeDriver: true,//độ mượt khi animation là 60fps
        }).start();
    }, [showRoleDropdown]);

    // Chuyển đổi số (0, 1) thành góc xoay (0deg, 180deg)
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });
    const roles = [
        { id: 'student', name: 'Học viên', icon: User },
        { id: 'instructor', name: 'Giảng viên', icon: Briefcase }
    ];
    const CurrentRoleIcon = roles.find(r => r.id === selectedRole).icon;
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Nền Gradient giống CSS Aurora (Làm tĩnh để mượt mà trên Mobile) */}
            <LinearGradient
                colors={['#2c3e50', '#2980b9', '#8e44ad', '#c0392b']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Khung Card trắng giống .auth-container */}
                <View style={styles.authContainer}>

                    {/* Nút Chọn Role (Giống .role-wrapper) */}
                    <View style={styles.roleWrapper}>
                        <BouncingButton
                            style={styles.roleSelected}
                            onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.roleInfo}>
                                <CurrentRoleIcon color="#6366f1" size={14} />
                                <Text style={styles.roleText}>
                                    {roles.find(r => r.id === selectedRole).name}
                                </Text>
                            </View>
                            {/*thẻ Animated.View để có "transform" animation 
                            - rotate dùng hàm spin để xoay 180 độ
                            */}
                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                <ChevronDown color="#9ca3af" size={14} />
                            </Animated.View>
                        </BouncingButton>

                        {/* Dropdown List */}
                        {showRoleDropdown && (
                            <View style={styles.roleOptions}>
                                {roles.map((role) => {
                                    const RoleIcon = role.icon;
                                    return (
                                        <TouchableOpacity
                                            key={role.id}
                                            style={styles.roleOptionItem}
                                            onPress={() => {
                                                setSelectedRole(role.id);
                                                setShowRoleDropdown(false);
                                            }}
                                        >
                                            <RoleIcon color="#6b7280" size={16} />
                                            <Text style={styles.roleOptionText}>{role.name}</Text>
                                            {selectedRole === role.id && <Check color="#10b981" size={14} style={{ marginLeft: 'auto' }} />}
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        )}
                    </View>

                    {/* Header */}
                    <View style={styles.authHeader}>
                        <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.headerIconBox}>
                            <GraduationCap color="white" size={32} />
                        </LinearGradient>
                        <Text style={styles.title}>EduTest</Text>
                        <Text style={styles.subtitle}>Hệ thống đánh giá năng lực trực tuyến</Text>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'login' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('login')}
                        >
                            <LogIn color={activeTab === 'login' ? "#4f46e5" : "#6b7280"} size={16} />
                            <Text style={[styles.tabBtnText, activeTab === 'login' && styles.tabBtnTextActive]}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'register' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('register')}
                        >
                            <UserPlus color={activeTab === 'register' ? "#4f46e5" : "#6b7280"} size={16} />
                            <Text style={[styles.tabBtnText, activeTab === 'register' && styles.tabBtnTextActive]}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nội dung Tab Đăng Nhập */}
                    {/* Nội dung Tab Đăng Nhập */}
                    {activeTab === 'login' && (
                        <View style={styles.formContent}>
                            <CustomInput
                                label="Tài khoản / Email"
                                icon={User}
                                placeholder="Nhập email..."
                                value={email}
                                onChangeText={setEmail}
                                error={errors.email}
                            />
                            <CustomInput
                                label="Mật khẩu"
                                icon={Lock}
                                placeholder="Nhập mật khẩu..."
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                error={errors.password}
                            />

                            <TouchableOpacity
                                style={styles.btnSubmit}
                                onPress={handleLogin} // <-- Gọi hàm validate thay vì chuyển trang ngay
                            >
                                <Text style={styles.btnSubmitText}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Nội dung Tab Đăng Ký */}
                    {activeTab === 'register' && (
                        <View style={styles.formContent}>
                            <CustomInput
                                label="Họ và tên"
                                icon={User}
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChangeText={setFullName}
                                error={errors.fullName}
                            />
                            <CustomInput
                                label="Email"
                                icon={Mail}
                                placeholder="email@example.com"
                                value={email}
                                onChangeText={setEmail}
                                error={errors.email}
                            />
                            <CustomInput
                                label="Mật khẩu"
                                icon={Lock}
                                placeholder="Nhập mật khẩu..."
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                error={errors.password}
                            />
                            <CustomInput
                                label="Xác nhận mật khẩu"
                                icon={ShieldCheck}
                                placeholder="Nhập lại mật khẩu..."
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                error={errors.confirmPassword}
                            />

                            <TouchableOpacity
                                style={styles.btnSubmit}
                                onPress={handleRegister} // <-- Gọi hàm validate đăng ký
                            >
                                <Text style={styles.btnSubmitText}>Tạo tài khoản</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
// --- CSS CHUYỂN THỂ SANG STYLESHEET ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 50,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    authContainer: {
        width: width * 0.9,
        maxWidth: 420,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 25,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
        marginTop: 40, // Để chừa chỗ cho Role Dropdown lồi lên
    },
    // Role Styles
    roleWrapper: {
        position: 'absolute',
        top: -60,
        left: '1%',
        zIndex: 100,
    },
    roleSelected: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    roleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    roleText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
    },
    //vị trí của Tab lựa chọn ROLE
    roleOptions: {
        position: 'absolute',
        top: '110%',
        left: '0%',
        backgroundColor: '#fff',
        width: 185,
        borderRadius: 12,
        padding: 5,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    roleOptionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        gap: 10,
    },
    roleOptionText: {
        fontSize: 13,
        color: '#4b5563',
    },
    // Header Styles
    authHeader: {
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 15,
    },
    headerIconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    // Tabs Styles
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        padding: 5,
        borderRadius: 50,
        marginBottom: 25,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    tabBtnActive: {
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tabBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
    },
    tabBtnTextActive: {
        color: '#4f46e5',
    },
    // Form Styles
    formGroup: {
        marginBottom: 15,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
    inputWrapperFocused: {
        borderColor: '#6366f1',
        backgroundColor: '#f5f3ff', // Nhấn nhá màu nền nhẹ khi focus
    },
    inputIcon: {
        marginRight: 10,
    },
    //icon ẩn/hiện mật khẩu
    eyeIcon: {
        position: 'absolute',
        right: 12, // Ép nó dính vào lề phải
        top: '50%',
        transform: [{ translateY: -9 }], // Căn giữa theo chiều dọc
    },
    formInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1f2937',
    },
    inputWrapperError: {
        borderColor: '#ef4444', // Viền đỏ
        backgroundColor: '#fef2f2', // Nền hơi hồng nhẹ
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    // Button Styles
    btnSubmit: {
        backgroundColor: '#6366f1',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    btnSubmitText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    }
});