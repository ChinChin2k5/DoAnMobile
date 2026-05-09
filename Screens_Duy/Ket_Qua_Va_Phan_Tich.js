import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ==========================================
// 1. COMPONENT SKELETON CHỚP TẮT
// ==========================================
const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />;
};

export default function Ket_Qua_Va_Phan_Tich({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);

  // --- NHẬN DỮ LIỆU TỪ ROUTE ---
  const { resultData } = route?.params || {};
  
  // NẾU KHÔNG CÓ DỮ LIỆU TRUYỀN SANG -> HIỂN THỊ CẢNH BÁO BẰNG DỮ LIỆU RỖNG
  const data = resultData || {
    score: 0,
    studentName: 'Chưa xác định',
    correctCount: 0,
    totalQuestions: 0,
    timeTaken: 0,
    examTitle: 'Chưa có dữ liệu bài thi',
    answersMap: {},
    questionsList: [] 
  };

  const incorrectCount = data.totalQuestions - data.correctCount;
  
  const m = Math.floor(data.timeTaken / 60);
  const s = data.timeTaken % 60;
  const timeSpentFormatted = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 750);
    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  const handleViewDetails = () => {
    navigation.navigate('Chi_Tiet_Dap_An', { resultData: data });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="arrow-back" size={24} color="#94a3b8" />
            <SkeletonItem width={150} height={20} style={{ marginLeft: 8 }} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}><SkeletonItem width="100%" height={250} /></View>
          <View style={styles.card}><SkeletonItem width="100%" height={150} /></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleGoHome}>
          <Ionicons name="arrow-back" size={24} color="#1d4ed8" />
          <Text style={styles.headerTitle}>Quay về trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoHome}>
          <Ionicons name="close-circle-outline" size={28} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>FINAL PERFORMANCE</Text>
          <View style={styles.scoreCircleContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{data.score}</Text>
              <Text style={styles.maxScoreText}>/ 10</Text>
            </View>
          </View>
          <Text style={styles.greetingText}>Excellent Work, {data.studentName}!</Text>
          <Text style={styles.descText}>
            Đã hoàn thành bài thi: {data.examTitle}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>RESPONSE ACCURACY</Text>
          <View style={styles.accuracyRow}>
            <View style={styles.donutChartPlaceholder}>
               <View style={[styles.chartSegment, { borderColor: '#2563eb', borderTopColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '45deg'}] }]} />
               <View style={[styles.chartSegment, { borderColor: '#dc2626', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: [{ rotate: '45deg'}] }]} />
               <View style={styles.innerCircle} />
            </View>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
                <Text style={styles.legendText}>{data.correctCount} Correct</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
                <Text style={styles.legendText}>{incorrectCount} Incorrect</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSubtitle}>EXAM VELOCITY (THỜI GIAN LÀM)</Text>
          <Text style={styles.timeText}>{timeSpentFormatted}</Text>
          <View style={styles.velocityBarBg}>
            <View style={[styles.velocityBarFill, { width: '100%' }]} />
          </View>
        </View>

        <View style={[styles.card, styles.actionCard]}>
          <View style={styles.accentBorder} />
          <Text style={styles.actionTitle}>Deep Dive Analysis</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleViewDetails}>
            <Text style={styles.primaryBtnText}>Xem chi tiết đáp án</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: '#f1f5f9', marginTop: 12 }]} 
            onPress={handleGoHome}
          >
            <Text style={[styles.primaryBtnText, { color: '#475569' }]}>Hoàn tất & Thoát</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 15 
  },
  backBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1d4ed8', 
    marginLeft: 8 
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  cardSubtitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#64748b', 
    letterSpacing: 1, 
    marginBottom: 20 
  },
  scoreCircleContainer: { alignItems: 'center', marginBottom: 24 },
  scoreCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 14, borderColor: '#4338ca', justifyContent: 'center', alignItems: 'center' },
  scoreText: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  maxScoreText: { fontSize: 16, fontWeight: '600', color: '#475569', marginTop: -5 },
  greetingText: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 8 },
  descText: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },
  accuracyRow: { flexDirection: 'row', alignItems: 'center' },
  donutChartPlaceholder: { 
    width: 80, 
    height: 80, 
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 30 
  },
  chartSegment: { 
    position: 'absolute', 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 12 
  },
  innerCircle: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: 'white', 
    position: 'absolute' 
  },
  legendContainer: { flex: 1, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  timeText: { fontSize: 32, fontWeight: '400', color: '#0f172a', marginBottom: 8 },
  velocityBarBg: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginTop: 16 },
  velocityBarFill: { height: 4, backgroundColor: '#3b82f6', borderRadius: 2 },
  actionCard: { position: 'relative', overflow: 'hidden', paddingLeft: 28, alignItems: 'center' },
  accentBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: '#2563eb' },
  actionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 15 },
  primaryBtn: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 14, 
    paddingHorizontal: 32, 
    borderRadius: 30, 
    width: '100%', 
    alignItems: 'center' 
  },
  primaryBtnText: { color: 'white', fontSize: 14, fontWeight: '600' }
});