import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { 
  Users, FileText, Zap, ShieldCheck, 
  MoreHorizontal, CheckCircle2, UserPlus, AlertTriangle, 
  ClipboardSignature, Shield 
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from "../components/Header";

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  
  // Dữ liệu 4 thẻ thống kê ở trên (Giữ nguyên)
  const stats = [
    {
      id: 1, title: "TOTAL USERS", value: "12,842", 
      icon: <Users color="#1A2134" size={20} />, iconBg: '#E8EFFB', badge: { text: "+12%", type: 'success' },
    },
    {
      id: 2, title: "TOTAL EXAMS", value: "4,290", 
      icon: <FileText color="#1A2134" size={20} />, iconBg: '#F3F4F6', badge: { text: "Live", type: 'primary' },
    },
    {
      id: 3, title: "ACTIVE SESSIONS", value: "512", 
      icon: <Zap color="#1A2134" size={20} />, iconBg: '#EDE9FE', badge: { text: "84% Full", type: 'warning' },
    },
    {
      id: 4, title: "SYSTEM HEALTH", value: "99.9%", 
      icon: <ShieldCheck color="#FFFFFF" size={20} />, iconBg: '#333333', badge: { text: "", type: 'online' }, isDark: true, 
    },
  ];

  return (
    <ScreenWrapper backgroundColor="#F5F7FA"> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Header title="Atoza Admin" leftIcon="grid-view" showBell={false} />

        <View style={styles.body}>
          {/* ========================================== */}
          {/* PHẦN 1: HEADER & CÁC NÚT BẤM VÀ 4 THẺ (CŨ) */}
          {/* ========================================== */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.dashBoard}>Dashboard Admin</Text>
            <Text style={styles.miniDashBoard}>Chào mừng trở lại, <Text style={styles.textBlue}>Quản Trị Viên</Text></Text>
          </View>

          <View style={styles.navButtonsRow}>
            <TouchableOpacity style={[styles.dashboardButton, styles.secondaryDashboardButton]} onPress={() => navigation.navigate("ConfigAdmin")}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="tune" size={18} color="#1A2134" style={styles.buttonIcon} />
                <Text style={[styles.dashboardButtonText, styles.secondaryDashboardButtonText]}>Config</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dashboardButton, styles.primaryDashboardButton]} onPress={() => navigation.navigate("ChartAdmin")}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="show-chart" size={18} color="white" style={styles.buttonIcon} />
                <Text style={[styles.dashboardButtonText, styles.primaryDashboardButtonText]}>View Analytics</Text>
              </View>
            </TouchableOpacity>
          </View>

          {stats.map((item) => (
            <View key={item.id} style={[styles.card, item.isDark && styles.cardDark]}>
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>{item.icon}</View>
                {item.badge.type !== 'online' ? (
                  <View style={[styles.badgeGlow, styles[`badgeGlow_${item.badge.type}`]]}>
                    <View style={[styles.badgeWrapper, styles[`badgeWrapper_${item.badge.type}`]]}>
                      <Text style={[styles.badgeText, styles[`badgeText_${item.badge.type}`]]}>{item.badge.text}</Text>
                    </View>
                  </View>
                ) : (<View style={styles.onlineBadge} />)}
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, item.isDark && styles.cardTitleDark]}>{item.title}</Text>
                <Text style={[styles.cardValue, item.isDark && styles.cardValueDark]}>{item.value}</Text>
              </View>
            </View>
          ))}

          {/* ========================================== */}
          {/* PHẦN 2: ACTIVE EXAM DISTRIBUTION (BIỂU ĐỒ) */}
          {/* ========================================== */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Exam{'\n'}Distribution</Text>
              <TouchableOpacity><MoreHorizontal color="#6F7F91" size={24} /></TouchableOpacity>
            </View>

            {/* Tuyệt chiêu vẽ Donut 75% bằng Border CSS */}
            <View style={styles.chartContainer}>
              <View style={styles.donutRing}>
                {/* Phải xoay chữ ngược lại vì cái khung ở ngoài đang bị xoay */}
                <View style={styles.donutTextContainer}>
                  <Text style={styles.donutPercent}>75%</Text>
                  <Text style={styles.donutSubText}>UTILIZATION</Text>
                </View>
              </View>
            </View>

            {/* Chú thích biểu đồ */}
            <View style={styles.legendContainer}>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#4C38D9'}]} /><Text style={styles.legendLabel}>Final Exams</Text></View>
                <Text style={styles.legendValue}>245</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#2563EB'}]} /><Text style={styles.legendLabel}>Mid-term Quizzes</Text></View>
                <Text style={styles.legendValue}>182</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#0369A1'}]} /><Text style={styles.legendLabel}>Certification Tests</Text></View>
                <Text style={styles.legendValue}>85</Text>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* PHẦN 3: RECENT SYSTEM LOGS */}
          {/* ========================================== */}
          <View style={styles.transparentSection}>
            <Text style={styles.sectionTitle}>Recent System Logs</Text>
            
            <View style={styles.logCard}>
              <View style={styles.logIconWrapper}><CheckCircle2 color="#10B981" size={22} /></View>
              <View style={styles.logTextWrapper}>
                <Text style={styles.logTitle}>Backup completed</Text>
                <Text style={styles.logDesc}>Global redundancy cluster</Text>
              </View>
              <Text style={styles.logTime}>2m{'\n'}ago</Text>
            </View>

            <View style={styles.logCard}>
              <View style={styles.logIconWrapper}><UserPlus color="#2563EB" size={22} /></View>
              <View style={styles.logTextWrapper}>
                <Text style={styles.logTitle}>50+ New Students Onboarded</Text>
                <Text style={styles.logDesc}>Department of Computer Science</Text>
              </View>
              <Text style={styles.logTime}>15m{'\n'}ago</Text>
            </View>

            <View style={styles.logCard}>
              <View style={styles.logIconWrapper}><AlertTriangle color="#F59E0B" size={22} /></View>
              <View style={styles.logTextWrapper}>
                <Text style={styles.logTitle}>High latency detected</Text>
                <Text style={styles.logDesc}>Asia-Pacific Edge Node</Text>
              </View>
              <Text style={styles.logTime}>42m{'\n'}ago</Text>
            </View>
          </View>

          {/* ========================================== */}
          {/* PHẦN 4: QUICK CONFIG (DARK CARD ĐÁY) */}
          {/* ========================================== */}
          <View style={styles.quickConfigCard}>
            <Text style={styles.qcTitle}>Quick Config</Text>
            <Text style={styles.qcDesc}>
              Modify core system parameters or deploy new examination instances across the network.
            </Text>
            <View style={styles.qcButtonsRow}>
              <TouchableOpacity style={styles.qcButton}>
                <ClipboardSignature color="#FFFFFF" size={20} style={{ marginBottom: 4 }} />
                <Text style={styles.qcButtonText}>NEW EXAM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qcButton}>
                <Shield color="#FFFFFF" size={20} style={{ marginBottom: 4 }} />
                <Text style={styles.qcButtonText}>SECURITY</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ==========================================
// BẢNG STYLE - FULL GIÁP ENTERPRISE
// ==========================================
const styles = StyleSheet.create({
  // ... (Gần như toàn bộ các CSS của đoạn cũ giữ nguyên, Đại ca chỉ thêm phần mới vào dưới)
  body: { paddingHorizontal: 16, paddingTop: 10 },
  headerTextContainer: { marginBottom: 20 },
  dashBoard: { fontSize: 34, fontFamily: "Inter-Black", color: '#1A2134' },
  miniDashBoard: { fontSize: 16, fontFamily: "Inter-SemiBold", color: '#6F7F91', marginTop: 4 },
  textBlue: { color: '#084CCB' },
  navButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  dashboardButton: { flex: 1, borderRadius: 100, paddingVertical: 14, justifyContent: 'center', alignItems: 'center' },
  primaryDashboardButton: { backgroundColor: '#084CCB', shadowColor: "#084CCB", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  secondaryDashboardButton: { backgroundColor: '#E8EFFB' },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  dashboardButtonText: { fontFamily: 'Inter-Bold', fontSize: 15 },
  buttonIcon: { marginRight: 8 },
  primaryDashboardButtonText: { color: '#FFFFFF' },
  secondaryDashboardButtonText: { color: '#1A2134' },
  card: { width: "100%", backgroundColor: "#FFFFFF", padding: 20, marginBottom: 20, borderRadius: 16, shadowColor: "#1A2134", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4 },
  cardDark: { backgroundColor: '#0A1128' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { alignItems: "flex-start" },
  cardTitle: { fontSize: 13, fontFamily: "Inter-SemiBold", color: "#6F7F91", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  cardValue: { fontSize: 32, fontFamily: "Inter-Black", color: "#1A2134" },
  cardTitleDark: { color: '#9CA3AF' }, cardValueDark: { color: '#FFFFFF' },
  badgeGlow: { borderRadius: 100, padding: 3 },
  badgeGlow_success: { shadowColor: "#10B981", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeGlow_primary: { shadowColor: "#084CCB", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeGlow_warning: { shadowColor: "#F59E0B", shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
  badgeWrapper: { borderRadius: 100, paddingVertical: 4, paddingHorizontal: 12 },
  badgeWrapper_success: { backgroundColor: '#ECFDF5' }, badgeWrapper_primary: { backgroundColor: '#E8EFFB' }, badgeWrapper_warning: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 12, fontFamily: "Inter-SemiBold" },
  badgeText_success: { color: '#10B981' }, badgeText_primary: { color: '#084CCB' }, badgeText_warning: { color: '#B45309' },
  onlineBadge: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981', marginRight: 6, shadowColor: "#10B981", shadowOpacity: 0.6, shadowRadius: 6, elevation: 4 },

  // ==========================================
  // CSS MỚI CHO ACTIVE EXAM DISTRIBUTION (DONUT)
  // ==========================================
  sectionCard: {
    backgroundColor: '#F9FAFB', // Màu nền cực sáng theo hình
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20, fontFamily: 'Inter-Black', color: '#0F172A', marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center', marginVertical: 20,
  },
  donutRing: {
    width: 160, height: 160,
    borderRadius: 80,
    borderWidth: 16,
    // TUYỆT KỸ CSS: 75% = 3 cạnh màu đậm, 1 cạnh màu nhạt. Xoay 45 độ!
    borderColor: '#4338CA', // 3 viền trên, phải, dưới
    borderLeftColor: '#E0E7FF', // Viền trái màu nhạt
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center', alignItems: 'center',
  },
  donutTextContainer: {
    // Trả lại phương hướng cho chữ bên trong
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
  },
  donutPercent: { fontSize: 32, fontFamily: 'Inter-Black', color: '#0F172A' },
  donutSubText: { fontSize: 10, fontFamily: 'Inter-Bold', color: '#6F7F91', letterSpacing: 1, marginTop: -4 },
  
  legendContainer: { marginTop: 10 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  legendLeft: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#0F172A' },
  legendValue: { fontSize: 16, fontFamily: 'Inter-Black', color: '#0F172A' },

  // ==========================================
  // CSS MỚI CHO RECENT SYSTEM LOGS
  // ==========================================
  transparentSection: { marginBottom: 24 },
  logCard: {
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#FFFFFF', borderRadius: 100, // Thẻ log bo tròn 2 đầu
    padding: 12, paddingRight: 20, marginBottom: 12,
  },
  logIconWrapper: {
    width: 40, height: 40, borderRadius: 20, 
    borderWidth: 1, borderColor: '#E2E8F0', // Vành mờ ngoài icon
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  logTextWrapper: { flex: 1 },
  logTitle: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#0F172A', marginBottom: 2 },
  logDesc: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#6F7F91' },
  logTime: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#9CA3AF', textAlign: 'right', lineHeight: 14 },

  // ==========================================
  // CSS MỚI CHO QUICK CONFIG
  // ==========================================
  quickConfigCard: {
    backgroundColor: '#0F172A', // Nền đen xanh cực sâu
    borderRadius: 24, padding: 24,
  },
  qcTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#FFFFFF', marginBottom: 8 },
  qcDesc: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#94A3B8', lineHeight: 22, marginBottom: 24 },
  qcButtonsRow: { flexDirection: 'row', gap: 16 },
  qcButton: {
    flex: 1, backgroundColor: '#1E293B', // Đen nhạt hơn nền
    borderRadius: 100, paddingVertical: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  qcButtonText: { fontSize: 12, fontFamily: 'Inter-Bold', color: '#FFFFFF' },
});