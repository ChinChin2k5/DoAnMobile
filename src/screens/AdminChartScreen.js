import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { 
  ShoppingCart, FileText, Users, DollarSign, 
  MoreHorizontal, Globe, Code, PenTool 
} from "lucide-react-native";
import Header from "../components/Header";

export default function ChartAdminScreen() {
  
  // DỮ LIỆU 4 THẺ THỐNG KÊ TRÊN CÙNG
  const analyticsStats = [
    {
      id: 1, title: "Weekly Orders", value: "1,284", 
      icon: <ShoppingCart color="#084CCB" size={20} />, 
      badge: { text: "+12%", type: 'success' },
    },
    {
      id: 2, title: "Exams Completed", value: "3,502", 
      icon: <FileText color="#084CCB" size={20} />, 
      badge: { text: "+8%", type: 'success' },
    },
    {
      id: 3, title: "New Enrollees", value: "459", 
      icon: <Users color="#084CCB" size={20} />, 
      // Chú ý thằng này màu ĐỎ (Giảm)
      badge: { text: "-2%", type: 'danger' },
    },
    {
      id: 4, title: "Revenue Growth", value: "$14.2k", 
      icon: <DollarSign color="#084CCB" size={20} />, 
      badge: { text: "+24%", type: 'success' },
    },
  ];

  // DỮ LIỆU KHỐI KỸ NĂNG (PROGRESS BAR)
  const topCourses = [
    { id: 1, name: "Foreign Languages", percent: 42, icon: <Globe color="#084CCB" size={20} /> },
    { id: 2, name: "Programming", percent: 35, icon: <Code color="#084CCB" size={20} /> },
    { id: 3, name: "Digital Arts", percent: 23, icon: <PenTool color="#084CCB" size={20} /> },
  ];

  return (
    <ScreenWrapper backgroundColor="#F5F7FA"> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header có nút Back để quay về Dashboard */}
        <Header title="Thống Kê Hệ Thống" leftIcon="arrow-back" showBell={true} />

        <View style={styles.body}>
          
          {/* ========================================== */}
          {/* PHẦN 1: 4 THẺ THỐNG KÊ NHỎ */}
          {/* ========================================== */}
          {analyticsStats.map((item) => (
            <View key={item.id} style={styles.miniCard}>
              <View style={styles.miniCardHeader}>
                <View style={styles.iconWrapper}>{item.icon}</View>
                {/* Badge xanh/đỏ */}
                <View style={[styles.badge, styles[`badge_${item.badge.type}`]]}>
                  <Text style={[styles.badgeText, styles[`badgeText_${item.badge.type}`]]}>
                    {item.badge.text}
                  </Text>
                </View>
              </View>
              <Text style={styles.miniCardTitle}>{item.title}</Text>
              <Text style={styles.miniCardValue}>{item.value}</Text>
            </View>
          ))}

          {/* ========================================== */}
          {/* PHẦN 2: TOP COURSE CATEGORIES (PROGRESS BARS) */}
          {/* ========================================== */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Course Categories</Text>
              <MoreHorizontal color="#6F7F91" size={20} />
            </View>

            {topCourses.map((course) => (
              <View key={course.id} style={styles.courseRow}>
                <View style={styles.iconWrapper}>{course.icon}</View>
                
                <View style={styles.courseInfo}>
                  <View style={styles.courseTextRow}>
                    <Text style={styles.courseName}>{course.name}</Text>
                    <Text style={styles.coursePercent}>{course.percent}%</Text>
                  </View>
                  
                  {/* TUYỆT KỸ VẼ PROGRESS BAR BẰNG 2 THẺ VIEW LỒNG NHAU */}
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${course.percent}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* ========================================== */}
          {/* PHẦN 3: STUDENT RETENTION RATE (DONUT 88%) */}
          {/* ========================================== */}
          <View style={styles.sectionCard}>
            <View style={styles.donutContainer}>
              {/* Vòng khuyên Donut */}
              <View style={styles.donutRing}>
                <View style={styles.donutTextContainer}>
                  <Text style={styles.donutPercent}>88%</Text>
                  <Text style={styles.donutSubText}>COMPLETION</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.retentionTitle}>Student Retention Rate</Text>
            <Text style={styles.retentionDesc}>
              Overall student satisfaction and course completion consistency is at an all-time high.
            </Text>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ==========================================
// BẢNG STYLE - CHUẨN PIXEL UI/UX
// ==========================================
const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 10 },
  
  // STYLE 4 THẺ THỐNG KÊ
  miniCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#1A2134", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  miniCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  iconWrapper: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8EFFB', // Xanh nhạt Enterprise
    justifyContent: 'center', alignItems: 'center',
  },
  miniCardTitle: { fontSize: 13, fontFamily: "Inter-SemiBold", color: "#6F7F91", marginBottom: 4 },
  miniCardValue: { fontSize: 26, fontFamily: "Inter-Black", color: "#1A2134" },
  
  // STYLE BADGE TĂNG/GIẢM
  badge: { borderRadius: 100, paddingVertical: 4, paddingHorizontal: 10 },
  badge_success: { backgroundColor: '#ECFDF5' }, // Nền xanh lá nhạt
  badge_danger: { backgroundColor: '#FEF2F2' },  // Nền đỏ nhạt
  badgeText: { fontSize: 12, fontFamily: "Inter-Bold" },
  badgeText_success: { color: '#10B981' }, // Chữ xanh lá
  badgeText_danger: { color: '#EF4444' },  // Chữ đỏ

  // STYLE KHỐI CHUNG
  sectionCard: {
    backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: "#1A2134", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Black', color: '#1A2134' },

  // STYLE PROGRESS BARS
  courseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  courseInfo: { flex: 1, marginLeft: 16 },
  courseTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  courseName: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#1A2134' },
  coursePercent: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#6F7F91' },
  progressBarBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 100, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#084CCB', borderRadius: 100 }, // Cái này sẽ co giãn theo width %

  // STYLE DONUT CHART
  donutContainer: { alignItems: 'center', marginVertical: 10, marginBottom: 24 },
  donutRing: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 14,
    borderColor: '#084CCB', // Viền xanh dương đậm
    borderRightColor: '#F3F4F6', // Cắt 1 góc bằng viền xám nhạt để tạo hình khuyên chưa hoàn thiện
    transform: [{ rotate: '45deg' }], // Xoay để góc khuyết nằm ở vị trí 3-4 giờ
    justifyContent: 'center', alignItems: 'center',
  },
  donutTextContainer: { transform: [{ rotate: '-45deg' }], alignItems: 'center' }, // Trả lại góc cho chữ
  donutPercent: { fontSize: 28, fontFamily: 'Inter-Black', color: '#1A2134' },
  donutSubText: { fontSize: 9, fontFamily: 'Inter-Bold', color: '#6F7F91', letterSpacing: 1, marginTop: 0 },
  
  retentionTitle: { fontSize: 16, fontFamily: 'Inter-Black', color: '#1A2134', textAlign: 'center', marginBottom: 8 },
  retentionDesc: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#6F7F91', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
});
