import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { 
  ShoppingCart, FileText, Users, DollarSign, 
  MoreHorizontal, Globe, Code, PenTool, BookOpen 
} from "lucide-react-native";
import Header from "../components/Header";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 

// 1. NHỚ IMPORT BÚT VẼ SVG VÀO ĐÂY NHÉ!
import Svg, { Circle } from 'react-native-svg';

const getIconForDomain = (domainName) => {
  switch(domainName) {
    case "Molecular Biology": return <Globe color="#084CCB" size={20} />;
    case "Literature": return <PenTool color="#084CCB" size={20} />;
    case "History": return <BookOpen color="#084CCB" size={20} />;
    default: return <Code color="#084CCB" size={20} />; 
  }
};

export default function ChartAdminScreen() {
  
  const [chartData, setChartData] = useState({
    totalUsers: "0", totalExams: "0", newMembers: "0", onlineTime: "0"
  });

  const [topCourses, setTopCourses] = useState([]);
  
  // 2. STATE MỚI CHO TỈ LỆ TRẢ LỜI ĐÚNG
  const [accuracyRate, setAccuracyRate] = useState(0);

  const fetchChartStats = async () => {
    try {
      // --- A. LẤY DỮ LIỆU 4 THẺ TỔNG QUAN ---
      const docRef = doc(db, "SystemSettings", "DashboardStats");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChartData({
          totalUsers: data.totalActiveUsers?.toString() || "0",
          totalExams: data.totalExams?.toString() || "0",
          newMembers: data.totalExamsToday?.toString() || "0", 
          onlineTime: (data.storageUsagePercentage || 10) 
        });
      }

      // --- B. LẤY VÀ TÍNH TOÁN TOP MÔN THI PHỔ BIẾN ---
      const examsSnapshot = await getDocs(collection(db, "Exams"));
      let totalExamsCount = 0;
      let domainCounts = {}; 

      examsSnapshot.forEach((examDoc) => {
        const examData = examDoc.data();
        if (examData.domain) {
          domainCounts[examData.domain] = (domainCounts[examData.domain] || 0) + 1;
          totalExamsCount++;
        }
      });

      if (totalExamsCount > 0) {
        const sortedCourses = Object.keys(domainCounts).map((domainName) => {
          const count = domainCounts[domainName];
          return {
            name: domainName,
            count: count, 
            percent: Math.round((count / totalExamsCount) * 100)
          };
        })
        .sort((a, b) => b.percent - a.percent) 
        .slice(0, 3); 

        const finalTopCourses = sortedCourses.map((course, index) => ({
          id: index + 1,
          name: course.name,
          percent: course.percent,
          icon: getIconForDomain(course.name) 
        }));
        setTopCourses(finalTopCourses);
      }

      // --- C. LẤY DATA HISTORY ĐỂ TÍNH TỈ LỆ LÀM ĐÚNG ---
      const historySnapshot = await getDocs(collection(db, "History"));
      let totalCorrectAll = 0;
      let totalQuestionsAll = 0;

      historySnapshot.forEach((doc) => {
        const historyData = doc.data();
        if (typeof historyData.correctCount === 'number' && typeof historyData.totalQuestions === 'number') {
          totalCorrectAll += historyData.correctCount;
          totalQuestionsAll += historyData.totalQuestions;
        }
      });

      if (totalQuestionsAll > 0) {
        const avgAccuracy = Math.round((totalCorrectAll / totalQuestionsAll) * 100);
        setAccuracyRate(avgAccuracy); 
      }

    } catch (error) {
      console.error("Lỗi kéo data thống kê:", error);
    }
  };

  useEffect(() => {
    fetchChartStats();
  }, []);

  const analyticsStats = [
    { id: 1, title: "Tổng Người Dùng", value: chartData.totalUsers, icon: <ShoppingCart color="#084CCB" size={20} />, badge: { text: "+12%", type: 'success' } },
    { id: 2, title: "Tổng Đề Thi Đã Hoàn Thành", value: chartData.totalExams, icon: <FileText color="#084CCB" size={20} />, badge: { text: "+8%", type: 'success' } },
    { id: 3, title: "Thành Viên Mới", value: chartData.newMembers, icon: <Users color="#084CCB" size={20} />, badge: { text: "-2%", type: 'danger' } },
    { id: 4, title: "Thời Gian Trực Tuyến", value: `${chartData.onlineTime}`, icon: <DollarSign color="#084CCB" size={20} />, badge: { text: "+24%", type: 'success' } },
  ];

  return (
    <ScreenWrapper backgroundColor="#F5F7FA"> 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <Header title="Thống Kê Hệ Thống" leftIcon="arrow-back" showBell={true} />

        <View style={styles.body}>
          
          {/* PHẦN 1: 4 THẺ THỐNG KÊ NHỎ */}
          {analyticsStats.map((item) => (
            <View key={item.id} style={styles.miniCard}>
              <View style={styles.miniCardHeader}>
                <View style={styles.iconWrapper}>{item.icon}</View>
                <View style={[styles.badge, styles[`badge_${item.badge.type}`]]}>
                  <Text style={[styles.badgeText, styles[`badgeText_${item.badge.type}`]]}>{item.badge.text}</Text>
                </View>
              </View>
              <Text style={styles.miniCardTitle}>{item.title}</Text>
              <Text style={styles.miniCardValue}>{item.value}</Text>
            </View>
          ))}

          {/* PHẦN 2: TOP COURSE CATEGORIES (PROGRESS BARS) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Môn Thi Phổ Biến</Text>
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
                  
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${course.percent}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* ========================================== */}
          {/* PHẦN 3: AVERAGE ACCURACY RATE (SVG DONUT)  */}
          {/* ========================================== */}
          <View style={styles.sectionCard}>
            <View style={styles.donutContainer}>
              <View style={{ width: 140, height: 140, justifyContent: 'center', alignItems: 'center' }}>
                
                {/* Xoay -90 độ để bắt đầu chạy từ đỉnh 12h */}
                <Svg width="140" height="140" style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                  {/* Vòng nền xám (Track) */}
                  <Circle
                    cx="70" cy="70" r="63"
                    stroke="#F3F4F6"
                    strokeWidth="14"
                    fill="none"
                  />
                  {/* Vòng xanh chạy theo Data (Progress) */}
                  <Circle
                    cx="70" cy="70" r="63"
                    stroke="#084CCB" // Xanh dương đậm theo màu chủ đạo của màn Chart
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={395.84} // Chu vi = 2 * PI * 63
                    strokeDashoffset={395.84 - ((accuracyRate / 100) * 395.84)} // Tính theo Data thật
                    strokeLinecap="butt" // Mặt cắt phẳng chuẩn Figma
                  />
                </Svg>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.donutPercent}>{accuracyRate}%</Text>
                  <Text style={styles.donutSubText}>ACCURACY</Text>
                </View>

              </View>
            </View>
            
            <Text style={styles.retentionTitle}>Tỉ Lệ Trả Lời Đúng Trung Bình</Text>
            <Text style={styles.retentionDesc}>
            Đánh giá tỷ lệ chọn đáp án chính xác của toàn bộ sinh viên trên toàn hệ thống dựa trên lịch sử làm bài.
            </Text>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// ==========================================
// BẢNG STYLE - ĐÃ ĐƯỢC DỌN SẠCH CSS RÁC!
// ==========================================
const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 10 },
  
  miniCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: "#1A2134", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  miniCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  iconWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8EFFB', justifyContent: 'center', alignItems: 'center' },
  miniCardTitle: { fontSize: 13, fontFamily: "Inter-SemiBold", color: "#6F7F91", marginBottom: 4 },
  miniCardValue: { fontSize: 26, fontFamily: "Inter-Black", color: "#1A2134" },
  
  badge: { borderRadius: 100, paddingVertical: 4, paddingHorizontal: 10 },
  badge_success: { backgroundColor: '#ECFDF5' }, 
  badge_danger: { backgroundColor: '#FEF2F2' },  
  badgeText: { fontSize: 12, fontFamily: "Inter-Bold" },
  badgeText_success: { color: '#10B981' }, 
  badgeText_danger: { color: '#EF4444' },  

  sectionCard: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, marginBottom: 16, shadowColor: "#1A2134", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Black', color: '#1A2134' },

  courseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  courseInfo: { flex: 1, marginLeft: 16 },
  courseTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  courseName: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#1A2134' },
  coursePercent: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: '#6F7F91' },
  progressBarBg: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 100, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#084CCB', borderRadius: 100 }, 

  donutContainer: { alignItems: 'center', marginVertical: 10, marginBottom: 24 },
  donutPercent: { fontSize: 28, fontFamily: 'Inter-Black', color: '#1A2134' },
  donutSubText: { fontSize: 9, fontFamily: 'Inter-Bold', color: '#6F7F91', letterSpacing: 1, marginTop: 0 },
  
  retentionTitle: { fontSize: 16, fontFamily: 'Inter-Black', color: '#1A2134', textAlign: 'center', marginBottom: 8 },
  retentionDesc: { fontSize: 13, fontFamily: 'Inter-Medium', color: '#6F7F91', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
});