import React, { Children, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, Animated, Easing
} from 'react-native';
// Yêu cầu cài đặt: npm install lucide-react-native
import {
  GraduationCap, ArrowRight, Award, CheckCircle2, BookOpen,
  Laptop, BarChart2, ShieldCheck, Zap, Users, Mail, Phone, MapPin,
  Pointer
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
//hàm const cho phép lấy chiều rộng của màn hình thiết bị, tỷ lệ pixel
const { width } = Dimensions.get('window');
// ngoặc () : Biểu thị Hàm / gọi Hàm / Nhóm các biểu thức
//  ()
//  │
//  ├─ Tham số hàm
//  │     const sum = (a, b) => {}
//  │
//  ├─ Gọi hàm
//  │     sum(1,2)
//  │
//  └─ Nhóm biểu thức
//        (a + b) * 2
// ngoặc {} : Biểu thị khối lệnh thực thi bên trong và cho phép chứa ít nhất 1 object
//  {}
//  │
//  ├─ Object
//  │     { name: "Duy", age: 20 }
//  │
//  ├─ Khối lệnh
//  │     if(true) { ... }
//  │
//  └─ Destructuring
//        const { name } = props
// ngoặc [] : biểu thị cho mảng Array
//  []
//  │
//  ├─ Array
//  │     [1,2,3]
//  │
//  ├─ Dependency (useEffect)
//  │     useEffect(()=>{}, [])
//  │
//  └─ Gộp style trong React Native
//        style={[style1, style2]}

// [{...}, {...}] : 1 mảng chứa các object
// 1. TẠO COMPONENT HIỆU ỨNG SLIDE DOWN & FADE IN (Cho các Section)
const FadeInSlideDown = ({ children, delay, style }) => {
  const animValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1250,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <Animated.View style={[style, { opacity: animValue, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
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

const featuresData = [
  { id: 1, title: 'Tạo đề thi dễ dàng', desc: 'Công cụ tạo đề thi trực quan với ngân hàng câu hỏi', icon: BookOpen, color: '#3b82f6', bg: '#eff6ff' },
  { id: 2, title: 'Thi trực tuyến', desc: 'Tổ chức kỳ thi trực tuyến an toàn với giám sát tự động', icon: Laptop, color: '#10b981', bg: '#ecfdf5' },
  { id: 3, title: 'Báo cáo chi tiết', desc: 'Phân tích kết quả thi với biểu đồ trực quan', icon: BarChart2, color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 4, title: 'Bảo mật cao', desc: 'Hệ thống bảo mật đa lớp đảm bảo an toàn thông tin', icon: ShieldCheck, color: '#ef4444', bg: '#fef2f2' },
  { id: 5, title: 'Chấm điểm tự động', desc: 'Chấm điểm nhanh chóng với thuật toán thông minh', icon: Zap, color: '#f59e0b', bg: '#fffbeb' },
  { id: 6, title: 'Quản lý người dùng', desc: 'Quản lý thí sinh, giáo viên và phân quyền linh hoạt', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
];

export default function App() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 75,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <GraduationCap color="#fff" size={20} />
            </View>
            <Text style={styles.logoText}>EduTest Pro</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* HERO SECTION */}
        <FadeInSlideDown delay={400} style={styles.hero}>
          <View style={styles.badge}>
            <Award color="#10b981" size={16} />
            <Text style={styles.badgeText}>Nền tảng thi trực tuyến hàng đầu</Text>
          </View>

          <Text style={styles.heroTitle}>Hệ thống Thi Trực Tuyến và Đánh Giá Năng Lực</Text>
          <Text style={styles.heroDesc}>Giải pháp toàn diện cho việc tạo đề thi, tổ chức thi trực tuyến và đánh giá năng lực học sinh.</Text>

          <View style={styles.heroButtons}>
            <BouncingButton style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Bắt đầu ngay</Text>
              <ArrowRight color="#fff" size={18} />
            </BouncingButton>

            <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Xem demo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Thí sinh</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Giáo viên</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Đề thi</Text>
            </View>
          </View>
        </FadeInSlideDown>

        <View style={styles.divider} />

        {/* MOCKUP CARD */}
        <FadeInSlideDown delay={600} style={styles.heroImage}>
          <LinearGradient
            colors={['#1e293b', '#4e1ebc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 20,
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              shadowColor: '#4e1ebc',
              shadowOffset: { width: 0, height: 15 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
            <LinearGradient colors={['rgba(120,200,255,0.6)', 'transparent']} style={{ position: 'absolute', width: 220, height: 220, top: -60, right: -60, borderRadius: 200 }} />
            <LinearGradient colors={['rgba(140,100,255,0.5)', 'transparent']} style={{ position: 'absolute', width: 220, height: 220, bottom: -60, left: -60, borderRadius: 200 }} />
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80 }} />

            <View style={styles.mockupCard}>
              <View style={styles.mockupHeader}>
                <View style={styles.mockupIcon}>
                  <CheckCircle2 color="#3b82f6" size={20} />
                </View>
                <View>
                  <Text style={styles.mockupTitle}>Kiểm tra năng lực</Text>
                  <Text style={styles.mockupSub}>Đang tiến hành</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>Hoàn thành</Text>
                  <Text style={styles.progressText}>75%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.mockupDetails}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Câu hỏi</Text>
                  <Text style={styles.detailValue}>30/40</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Thời gian</Text>
                  <Text style={[styles.detailValue, { color: '#10b981' }]}>25:30</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </FadeInSlideDown>

        <View style={styles.divider} />

        {/* FEATURES SECTION */}
        <FadeInSlideDown delay={700} style={styles.features}>
          <Text style={styles.sectionTitle}>Tính năng nổi bật</Text>
          <Text style={styles.sectionDesc}>Hệ thống được thiết kế để đáp ứng mọi nhu cầu trong quá trình tổ chức thi.</Text>

          <View style={styles.featuresGrid}>
            {featuresData.map((item) => (
              <View key={item.id} style={styles.featureCard}>
                <View style={[styles.featureIconWrap, { backgroundColor: item.bg }]}>
                  <item.icon color={item.color} size={24} />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </FadeInSlideDown>

        <View style={styles.divider} />

        {/* ABOUT SECTION */}
        <FadeInSlideDown delay={1000} style={styles.about}>
          <Text style={styles.sectionTitle}>Về EduTest Pro</Text>
          <Text style={styles.sectionDesc}>Nền tảng thi trực tuyến hàng đầu, thiết kế đặc biệt cho các trường học và tổ chức giáo dục.</Text>

          <View style={styles.aboutStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5+</Text>
              <Text style={styles.statLabel}>Năm kinh nghiệm</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Trường học tin dùng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Độ tin cậy</Text>
            </View>
          </View>
        </FadeInSlideDown>

      </ScrollView>
    </SafeAreaView>
  );
}
//--- STYLES ---
const COLORS = {
  primary: '#3b82f6',
  textMain: '#1e293b',
  textMuted: '#64748b',
  bgMain: '#ffffff',
  bgLight: '#f8fafc',
  border: '#e2e8f0',
};
const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgMain
  },
  container: {
    flex: 1,
    paddingTop: 30,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#a2abbf',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,00.5)',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain
  },

  // Buttons
  btnPrimarySmall: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    cursor: 'pointer',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    cursor: 'pointer'
  },
  btnOutline: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },
  btnOutlineText: {
    color: COLORS.textMain,
    fontWeight: '600',
    fontSize: 15
  },

  // Hero
  hero: {
    padding: 20,
    backgroundColor: COLORS.bgLight
  },
  heroImage: {
    marginTop: 20,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  badgeText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 13
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textMain,
    lineHeight: 40,
    marginBottom: 16
  },
  heroDesc: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    marginBottom: 24
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40
  },

  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4
  },

  // Mockup Card
  mockupContainer: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 20
  },
  mockupCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10 //cho Android 
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20
  },
  mockupIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mockupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain
  },
  mockupSub: {
    fontSize: 13,
    color: COLORS.textMuted
  },

  progressSection: {
    marginBottom: 20
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMain
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.bgLight,
    borderRadius: 4
  },
  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4
  },

  mockupDetails: {
    flexDirection: 'row',
    gap: 12
  },
  detailBox: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    padding: 12,
    borderRadius: 8
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain
  },

  // Features
  features: {
    padding: 20,
    backgroundColor: '#eff6ffa2',
    paddingVertical: 40
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 12
  },
  sectionDesc: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22
  },
  featuresGrid: { gap: 16 },
  featureCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 8,
    //cài đặt flexWrap để 100% có tác dụng
    width: '100%',
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    //cài đặt flexWrap để 100% có tác dụng
    width: '100%',
    textAlign: 'center',
  },

  // About
  about: {
    padding: 20,
    backgroundColor: '#e2e8f0',
    paddingVertical: 40
  },
  aboutStats: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 20,
    //cách Bottom khỏi điện thoại
    paddingBottom: 100,
  },
});
