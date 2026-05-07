import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { useTranslation } from 'react-i18next';
import { 
  Users, FileText, Zap, ShieldCheck, 
  MoreHorizontal, CheckCircle2, 
  ClipboardSignature, Shield, Clock
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
// THÊM ĐỒ NGHỀ FIREBASE ĐỂ KÉO NHIỀU COLLECTION
import { doc, getDoc, collection, getDocs } from "firebase/firestore"; 
import { db } from "../../firebaseConfig";
import Header from "../components/Header";
import ButtonNice from "../components/Button";
import Svg, { Circle } from 'react-native-svg';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  // 1. STATE CHO 4 THẺ TỔNG QUAN
  const [dashboardData, setDashboardData] = useState({
    totalUsers: "0", totalExams: "0", activeSessions: "0", systemHealth: "100%"
  });

  // 2. STATE CHO BIỂU ĐỒ DONUT (Phân bố độ khó câu hỏi)
  const [examDist, setExamDist] = useState({
    hard: 0, medium: 0, easy: 0, publishedPercent: 75
  });

  // 3. STATE CHO HOẠT ĐỘNG GẦN ĐÂY
  const [recentLogs, setRecentLogs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // HÀM GỌI HỒN DATA TỪ FIREBASE
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // --- A. LẤY 4 THẺ TỔNG QUAN (CŨ) ---
      const docRef = doc(db, "SystemSettings", "DashboardStats");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const backendStats = docSnap.data();
        setDashboardData({
          totalUsers: backendStats.totalActiveUsers?.toString() || "0",
          totalExams: backendStats.totalExams?.toString() || "0",
          activeSessions: backendStats.totalExamsToday?.toString() || "0",
          systemHealth: (backendStats.storageUsagePercentage || 100) + "%" 
        });
      }

      // --- B. LẤY PHÂN BỐ ĐỘ KHÓ TỪ BẢNG EXAMS ---
      const examsSnap = await getDocs(collection(db, "Exams"));
      let hardCount = 0, mediumCount = 0, easyCount = 0;
      let totalExams = 0, publishedExams = 0;

      examsSnap.forEach(doc => {
        const data = doc.data();
        totalExams++;
        if (data.status === "PUBLISHED") publishedExams++;
        
        // Quét vào từng câu hỏi để đếm độ khó
        const questions = data.questionsList || data.questions || [];
        questions.forEach(q => {
          if (q.difficulty === "Hard") hardCount++;
          else if (q.difficulty === "Medium") mediumCount++;
          else easyCount++; // Mặc định Dễ nếu không rõ
        });
      });
      
      const pubPercent = totalExams > 0 ? Math.round((publishedExams / totalExams) * 100) : 0;
      setExamDist({ hard: hardCount, medium: mediumCount, easy: easyCount, publishedPercent: pubPercent });

      // --- C. LẤY LỊCH SỬ NỘP BÀI GẦN ĐÂY TỪ BẢNG HISTORY ---
      const historySnap = await getDocs(collection(db, "History"));
      let logs = [];
      
      historySnap.forEach(doc => {
        const data = doc.data();
        if (data.completedAt && data.studentName) {
          logs.push(data);
        }
      });

      // Sắp xếp giảm dần theo thời gian (Mới nhất lên đầu)
      logs.sort((a, b) => b.completedAt.toMillis() - a.completedAt.toMillis());

      // Format lại data cho UI (Chỉ lấy 3 người mới nhất)
      const formattedLogs = logs.slice(0, 3).map((log, index) => {
        // Thuật toán tính "Thời gian trôi qua" siêu cấp vũ trụ
        const date = log.completedAt.toDate();
        const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
        
        let timeStr = `${diffMins}m\nago`;
        if (diffMins > 60) {
          const diffHrs = Math.floor(diffMins / 60);
          timeStr = `${diffHrs}h\nago`;
          if (diffHrs >= 24) timeStr = `${Math.floor(diffHrs/24)}d\nago`;
        }

        // Điểm cao (>=8) thì màu Xanh, điểm thường thì màu Xanh dương
        const isHigh = log.score >= 8;

        return {
          id: index,
          title: `${log.studentName} nộp bài`,
          desc: `${log.examTitle} - Đạt ${log.score}đ`,
          timeStr: timeStr,
          icon: isHigh ? <CheckCircle2 color="#10B981" size={22} /> : <Clock color="#2563EB" size={22} />
        };
      });
      
      setRecentLogs(formattedLogs);

    } catch(error) {
      console.error("Lỗi gọi Firebase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true); 
    await fetchDashboardStats(); 
    setRefreshing(false); 
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []); 

  // Dữ liệu 4 thẻ thống kê ở trên
  const stats = [
    { id: 1, title: t('dashboard.totalUsers'), value: dashboardData.totalUsers, icon: <Users color="#1A2134" size={20} />, iconBg: '#E8EFFB', badge: { text: "+12%", type: 'success' } },
    { id: 2, title: t('dashboard.totalExams'), value: dashboardData.totalExams, icon: <FileText color="#1A2134" size={20} />, iconBg: '#F3F4F6', badge: { text: "Live", type: 'primary' } },
    { id: 3, title: t('dashboard.activeSessions'), value: dashboardData.activeSessions, icon: <Zap color="#1A2134" size={20} />, iconBg: '#EDE9FE', badge: { text: "84% Full", type: 'warning' } },
    { id: 4, title: t('dashboard.systemHealth'), value: dashboardData.systemHealth, icon: <ShieldCheck color="#FFFFFF" size={20} />, iconBg: '#333333', badge: { text: "", type: 'online' }, isDark: true },
  ];

  return (
    <ScreenWrapper backgroundColor="#E5EEFF">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#084CCB']} tintColor="#084CCB" />
      }>
        <Header title={t('dashboard.systemHealth')} leftIcon="grid-view" showBell={false} />

        <View style={styles.body}>
          {/* ========================================== */}
          {/* PHẦN 1: HEADER & 4 THẺ TỔNG QUAN */}
          {/* ========================================== */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.dashBoard}>{t('dashboard.headerTitle')}</Text>
            <Text style={styles.miniDashBoard}>{t('dashboard.welcomeBack')} <Text style={styles.textBlue}>{t('dashboard.adminRole')}</Text></Text>
          </View>

          <View style={styles.navButtonsRow}>
            <ButtonNice text={t('dashboard.btnConfig')} iconName="tune" iconPosition="left" customStyle={{ width: 150, backgroundColor: '#DCE9FF' }} customTextStyle={{ color: '#003FA4' }} iconColor="#003FA4" onPress={() => navigation.navigate("ConfigAdmin")} />
            <ButtonNice text={t('dashboard.btnStatistics')} iconName="show-chart" iconPosition="left" customStyle={{ width: 190, backgroundColor: '#0050CB' }} onPress={() => navigation.navigate("ChartAdmin")} />
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
          {/* PHẦN 2: ACTIVE QUESTION DISTRIBUTION (BẺ LÁI) */}
          {/* ========================================== */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('dashboard.chartTitle')}{'\n'}</Text>
              <TouchableOpacity><MoreHorizontal color="#6F7F91" size={24} /></TouchableOpacity>
            </View>

            {/* ========================================== */}
            {/* TUYỆT KỸ SVG: BIỂU ĐỒ CHẠY BẰNG DATA THẬT */}
            {/* ========================================== */}
            <View style={styles.chartContainer}>
              <View style={{ width: 160, height: 160, justifyContent: 'center', alignItems: 'center' }}>
                
                {/* Dùng transform rotate -90deg để điểm xuất phát luôn luôn nằm ở đỉnh 12 giờ */}
                <Svg width="160" height="160" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                  
                  {/* 1. VÒNG NỀN TRỐNG (Màu xám nhạt) */}
                  <Circle
                    cx="80" cy="80" r="72"
                    stroke="#E0E7FF"
                    strokeWidth="16"
                    fill="none"
                  />

                  {/* 2. VÒNG DỮ LIỆU CHẠY ĐỘNG (Màu xanh đậm) */}
                  <Circle
                    cx="80" cy="80" r="72"
                    stroke="#4338CA"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={452.389} // Trọng số Toán Học: Chu vi hình tròn = 2 * Pi * Bán kính (72)
                    // CÔNG THỨC ĂN TIỀN: Data thay đổi -> Thuật toán này tự tính toán độ dài nét vẽ!
                    strokeDashoffset={452.389 - ((examDist.publishedPercent / 100) * 452.389)}
                    strokeLinecap="butt" // QUAN TRỌNG NHẤT: Cắt phẳng 2 đầu mút chuẩn 100% Figma!
                  />
                </Svg>

                {/* 3. CHỮ HIỂN THỊ DỮ LIỆU Ở GIỮA */}
                <View style={{ alignItems: 'center' }}>
                  {/* Biến state sẽ tự nhảy số liệu khi có Data từ Firebase bốc về */}
                  <Text style={styles.donutPercent}>{examDist.publishedPercent}%</Text>
                  <Text style={styles.donutSubText}>UTILIZATION</Text>
                </View>

              </View>
            </View>

            <View style={styles.legendContainer}>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#4C38D9'}]} /><Text style={styles.legendLabel}>{t('dashboard.hard')}</Text></View>
                <Text style={styles.legendValue}>{examDist.hard}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#2563EB'}]} /><Text style={styles.legendLabel}>{t('dashboard.medium')}</Text></View>
                <Text style={styles.legendValue}>{examDist.medium}</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}><View style={[styles.legendDot, {backgroundColor: '#0369A1'}]} /><Text style={styles.legendLabel}>{t('dashboard.easy')}</Text></View>
                <Text style={styles.legendValue}>{examDist.easy}</Text>
              </View>
            </View>
          </View>

          {/* ========================================== */}
          {/* PHẦN 3: HOẠT ĐỘNG GẦN ĐÂY (BẺ LÁI LOGS) */}
          {/* ========================================== */}
          <View style={styles.transparentSection}>
            <Text style={styles.sectionTitle}>{t('dashboard.logTitle')}</Text>
            
            {recentLogs.length > 0 ? recentLogs.map(log => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logIconWrapper}>{log.icon}</View>
                <View style={styles.logTextWrapper}>
                  <Text style={styles.logTitle}>{log.title}</Text>
                  <Text style={styles.logDesc} numberOfLines={1}>{log.desc}</Text>
                </View>
                <Text style={styles.logTime}>{log.timeStr}</Text>
              </View>
            )) : (
              <Text style={{ textAlign: 'center', color: '#6F7F91', marginTop: 10 }}>{t('dashboard.logEmpty')}</Text>
            )}
          </View>

          {/* ========================================== */}
          {/* PHẦN 4: QUICK CONFIG */}
          {/* ========================================== */}
          <View style={styles.quickConfigCard}>
            <Text style={styles.qcTitle}>{t('dashboard.quickConfigTitle')}</Text>
            <Text style={styles.qcDesc}>
            {t('dashboard.quickConfigDesc')}
            </Text>
            <View style={styles.qcButtonsRow}>
              <TouchableOpacity style={styles.qcButton}>
                <ClipboardSignature color="#FFFFFF" size={20} style={{ marginBottom: 4 }} />
                <Text style={styles.qcButtonText}>{t('dashboard.btnNewExam')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qcButton}>
                <Shield color="#FFFFFF" size={20} style={{ marginBottom: 4 }} />
                <Text style={styles.qcButtonText}>{t('dashboard.btnSecurity')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// BẢNG STYLE GIỮ NGUYÊN HOÀN TOÀN TỪ CŨ
const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 10 },
  headerTextContainer: { marginBottom: 20 },
  dashBoard: { fontSize: 34, fontFamily: "Inter-Black", color: '#1A2134' },
  miniDashBoard: { fontSize: 16, fontFamily: "Inter-SemiBold", color: '#6F7F91', marginTop: 4 },
  textBlue: { color: '#084CCB' },
  navButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
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
  sectionCard: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter-Black', color: '#0F172A', marginBottom: 16 },
  chartContainer: { alignItems: 'center', marginVertical: 20 },
  donutRing: { width: 160, height: 160, borderRadius: 80, borderWidth: 16, borderColor: '#4338CA', borderLeftColor: '#E0E7FF', transform: [{ rotate: '45deg' }], justifyContent: 'center', alignItems: 'center' },
  donutTextContainer: { transform: [{ rotate: '-45deg' }], alignItems: 'center' },
  donutPercent: { fontSize: 32, fontFamily: 'Inter-Black', color: '#0F172A' },
  donutSubText: { fontSize: 10, fontFamily: 'Inter-Bold', color: '#6F7F91', letterSpacing: 1, marginTop: -4 },
  legendContainer: { marginTop: 10 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  legendLeft: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendLabel: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: '#0F172A' },
  legendValue: { fontSize: 16, fontFamily: 'Inter-Black', color: '#0F172A' },
  transparentSection: { marginBottom: 24 },
  logCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 100, padding: 12, paddingRight: 20, marginBottom: 12 },
  logIconWrapper: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logTextWrapper: { flex: 1 },
  logTitle: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#0F172A', marginBottom: 2 },
  logDesc: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#6F7F91' },
  logTime: { fontSize: 11, fontFamily: 'Inter-Medium', color: '#9CA3AF', textAlign: 'right', lineHeight: 14 },
  quickConfigCard: { backgroundColor: '#0F172A', borderRadius: 24, padding: 24 },
  qcTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#FFFFFF', marginBottom: 8 },
  qcDesc: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#94A3B8', lineHeight: 22, marginBottom: 24 },
  qcButtonsRow: { flexDirection: 'row', gap: 16 },
  qcButton: { flex: 1, backgroundColor: '#1E293B', borderRadius: 100, paddingVertical: 14, justifyContent: 'center', alignItems: 'center' },
  qcButtonText: { fontSize: 12, fontFamily: 'Inter-Bold', color: '#FFFFFF' }
});