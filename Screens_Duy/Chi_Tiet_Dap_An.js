import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Animated
} from 'react-native';
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

    return (
        <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />
    );
};

export default function Ket_Qua_Va_Phan_Tich({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(true);

    // Lấy dữ liệu từ màn hình trước truyền sang
    const { resultData } = route?.params || {};

    // Dữ liệu mặc định nếu chưa có
    const data = resultData || {
        examId: 'AZ-992841',
        score: 8.75,
        correctCount: 35,
        totalQuestions: 40,
        timeTaken: 1452,
        questionsList: [],
        answersMap: {}
    };

    const m = Math.floor(data.timeTaken / 60);
    const s = data.timeTaken % 60;
    const timeString = `${m}m ${s}s`;

    // Giả lập thời gian load dữ liệu (hoặc có thể bỏ timeout nếu dữ liệu đã có sẵn)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // ==========================================
    // RENDER GIAO DIỆN SKELETON (KHI ĐANG LOAD)
    // ==========================================
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="arrow-back" size={24} color="#cbd5e1" />
                    <SkeletonItem width={120} height={20} />
                    <Ionicons name="ellipsis-vertical" size={20} color="#cbd5e1" />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Skeleton Card Điểm */}
                    <View style={styles.scoreCard}>
                        <SkeletonItem width={120} height={120} borderRadius={60} style={{ marginBottom: 20 }} />
                        <SkeletonItem width={200} height={24} style={{ marginBottom: 10 }} />
                        <SkeletonItem width={250} height={16} />
                    </View>

                    {/* Skeleton Lưới Thống kê */}
                    <View style={styles.statsGrid}>
                        {[1, 2, 3, 4].map((item) => (
                            <View key={item} style={styles.statBox}>
                                <SkeletonItem width={24} height={24} borderRadius={12} style={{ marginBottom: 8 }} />
                                <SkeletonItem width={80} height={12} style={{ marginBottom: 6 }} />
                                <SkeletonItem width={60} height={16} />
                            </View>
                        ))}
                    </View>

                    {/* Skeleton Câu hỏi */}
                    <View style={styles.qCard}>
                        <View style={styles.qHeader}>
                            <SkeletonItem width={30} height={30} borderRadius={15} style={{ marginRight: 10 }} />
                            <SkeletonItem width={150} height={14} />
                        </View>
                        <SkeletonItem width="100%" height={16} style={{ marginBottom: 6 }} />
                        <SkeletonItem width="80%" height={16} style={{ marginBottom: 20 }} />

                        {[1, 2, 3, 4].map((opt) => (
                            <SkeletonItem key={opt} width="100%" height={50} borderRadius={12} style={{ marginBottom: 10 }} />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // ==========================================
    // RENDER GIAO DIỆN THỰC TẾ
    // ==========================================
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1e40af" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Review Results</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* THẺ ĐIỂM SỐ */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreNumber}>{data.score}</Text>
                        <Text style={styles.scoreLabel}>SCORE</Text>
                    </View>
                    <View style={styles.badgeIcon}>
                        <Ionicons
                            name={
                                data.score >= 9 ? "trophy" :
                                    data.score >= 8 ? "star" :
                                        data.score >= 5 ? "star-half" :
                                            "alert-circle"
                            }
                            size={24}
                            color={
                                data.score >= 9 ? "#facc15" :
                                    data.score >= 8 ? "#22c55e" :
                                        data.score >= 5 ? "#3b82f6" :
                                            "#ef4444"
                            }
                        />
                    </View>
                    <Text style={styles.msgTitle}>
                        {
                            data.score >= 9 ? 'Outstanding!' :
                                data.score >= 8 ? 'Excellent Performance!' :
                                    data.score >= 5 ? 'You doing good!' :
                                        'Cần cố gắng hơn! 💪'
                        }
                    </Text>

                    <Text style={styles.msgSub}>
                        {
                            data.score >= 9 ? "You mastered the material at an exceptional level." :
                                data.score >= 8 ? "You've demonstrated a deep understanding of the course materials." :
                                    data.score >= 5 ? "Học, học nữa, học mãi✊" :
                                        "Học, học nữa, học mãi ✊."
                        }
                    </Text>
                </View>

                {/* LƯỚI THỐNG KÊ */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Ionicons name="checkmark-done-circle-outline" size={22} color="#3b82f6" />
                        <Text style={styles.statLabel}>Trạng thái</Text>
                        <Text style={[styles.statValue, { color: '#2563eb' }]}>Hoàn thành</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="checkmark-circle-outline" size={22} color="#3b82f6" />
                        <Text style={styles.statLabel}>Số câu đúng</Text>
                        <Text style={styles.statValue}>{data.correctCount}/{data.totalQuestions}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="finger-print-outline" size={22} color="#94a3b8" />
                        <Text style={styles.statLabel}>Mã bài làm</Text>
                        <Text style={styles.statValue}>#{data.examId.slice(-6).toUpperCase()}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Ionicons name="time-outline" size={22} color="#94a3b8" />
                        <Text style={styles.statLabel}>Thời gian</Text>
                        <Text style={styles.statValue}>{timeString}</Text>
                    </View>
                </View>

                {/* NÚT ĐIỀU HƯỚNG */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('MainTabs')}>
                        <Ionicons name="home-outline" size={16} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.btnPrimaryText}>Quay về trang chủ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary}>
                        <Ionicons name="print-outline" size={18} color="#1e293b" style={{ marginRight: 6 }} />
                        <Text style={styles.btnSecondaryText}>In kết quả</Text>
                    </TouchableOpacity>
                </View>

                {/* TIÊU ĐỀ PHÂN TÍCH */}
                <View style={styles.analysisHeader}>
                    <Text style={styles.analysisTitle}>Phân tích câu hỏi</Text>
                    <View style={styles.filterChip}>
                        <View style={styles.dot} />
                        <Text style={styles.filterChipText}>Tất cả câu hỏi ({data.totalQuestions})</Text>
                    </View>
                </View>

                {/* DANH SÁCH CÂU HỎI & ĐÁP ÁN */}
                {data.questionsList?.map((q, index) => {
                    // Logic xử lý đúng sai cho toàn bộ câu hỏi (không dùng toán tử 3 ngôi lồng nhau)
                    const userSelectedId = data.answersMap[q.id];
                    const isQuestionCorrect = userSelectedId === String(q.correctIndex);

                    let headerIconName = "close-circle";
                    let headerIconColor = "#ef4444";

                    if (isQuestionCorrect) {
                        headerIconName = "checkmark-circle";
                        headerIconColor = "#10b981";
                    }

                    return (
                        <View key={q.id} style={styles.qCard}>
                            {/* Header câu hỏi */}
                            <View style={styles.qHeader}>
                                <View style={[styles.qNumBadge, !isQuestionCorrect && { backgroundColor: '#fef2f2' }]}>
                                    <Text style={[styles.qNumText, !isQuestionCorrect && { color: '#ef4444' }]}>
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </Text>
                                </View>
                                <Text style={styles.qDomainText}>{q.domain || 'LÝ THUYẾT KIẾN THỨC'}</Text>
                                <Ionicons
                                    name={headerIconName}
                                    size={20}
                                    color={headerIconColor}
                                    style={{ marginLeft: 'auto' }}
                                />
                            </View>

                            <Text style={styles.qContentText}>{q.content}</Text>

                            {/* Danh sách các lựa chọn */}
                            <View style={styles.optionsList}>
                                {q.options.map((opt) => {
                                    const isUserChoice = userSelectedId === opt.id;
                                    const isActualCorrect = String(q.correctIndex) === opt.id;

                                    // Xử lý Logic Box Style rõ ràng bằng if/else
                                    let boxStyle = styles.optBoxDefault;
                                    let rightIcon = null;
                                    let showUserChoiceTag = false;
                                    let showCorrectTag = false;
                                    let tagChoiceColor = '#1d4ed8'; // Mặc định xanh dương

                                    if (isUserChoice && isActualCorrect) {
                                        boxStyle = styles.optBoxUserCorrect;
                                        showUserChoiceTag = true;
                                        tagChoiceColor = '#1d4ed8';
                                        rightIcon = <Ionicons name="checkmark-circle" size={20} color="#1d4ed8" style={{ marginLeft: 8 }} />;
                                    }
                                    else if (isUserChoice && !isActualCorrect) {
                                        boxStyle = styles.optBoxUserWrong;
                                        showUserChoiceTag = true;
                                        tagChoiceColor = '#b91c1c'; // Màu đỏ khi chọn sai
                                        rightIcon = <Ionicons name="close-circle" size={20} color="#b91c1c" style={{ marginLeft: 8, }} />;
                                    }
                                    else if (!isUserChoice && isActualCorrect) {
                                        boxStyle = styles.optBoxActualCorrect;
                                        showCorrectTag = true;
                                        rightIcon = <Ionicons name="checkmark-circle" size={20} color="#10b981" style={{ marginLeft: 8 }} />;
                                    }
                                    else {
                                        rightIcon = <View style={styles.optCircleDefault} />;
                                    }

                                    return (
                                        <View key={opt.id} style={[styles.optBox, boxStyle]}>
                                            <Text style={styles.optText}>{opt.text}</Text>

                                            {showUserChoiceTag && (
                                                <View style={[styles.tagChoice, { backgroundColor: tagChoiceColor }]}>
                                                    <Text style={styles.tagChoiceText}>LỰA CHỌN CỦA BẠN</Text>
                                                </View>
                                            )}

                                            {showCorrectTag && (
                                                <Text style={styles.tagCorrectAnswerText}>(Đáp án đúng)</Text>
                                            )}

                                            {rightIcon}
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Khối Giải Thích (Chỉ hiện khi trả lời sai) */}
                            {!isQuestionCorrect && (
                                <View style={styles.explanationBox}>
                                    <Ionicons name="information-circle-outline" size={18} color="#1e40af" style={{ marginTop: 2 }} />
                                    <Text style={styles.explanationText}>
                                        <Text style={{ fontWeight: 'bold', color: '#1e3a8a' }}>Giải thích: </Text>
                                        {q.explanation || 'Đáp án bạn chọn chưa chính xác. Vui lòng xem lại tài liệu khóa học để hiểu rõ hơn về khái niệm này.'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc',paddingTop:40, paddingBottom:60, },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

    scoreCard: { backgroundColor: 'white', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 20, position: 'relative', elevation: 1 },
    scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    scoreNumber: { fontSize: 26, fontWeight: '900', color: '#1e40af' },
    scoreLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b', letterSpacing: 1 },
    badgeIcon: { position: 'absolute', top: 20, right: 20, backgroundColor: '#f3f4f6', padding: 10, borderRadius: 25 },
    msgTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
    msgSub: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    statBox: { width: '48%', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, marginBottom: 12 },
    statLabel: { fontSize: 11, color: '#64748b', marginTop: 8, marginBottom: 4 },
    statValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },

    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    btnPrimary: { flex: 1, flexDirection: 'row', backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    btnPrimaryText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
    btnSecondary: { flex: 1, flexDirection: 'row', backgroundColor: '#e2e8f0', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    btnSecondaryText: { color: '#1e293b', fontWeight: 'bold', fontSize: 13 },

    analysisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    analysisTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginRight: 6 },
    filterChipText: { fontSize: 11, color: '#3b82f6', fontWeight: 'bold' },

    qCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 1 },
    qHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    qNumBadge: { backgroundColor: '#eff6ff', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    qNumText: { color: '#1d4ed8', fontWeight: 'bold', fontSize: 12 },
    qDomainText: { fontSize: 11, fontWeight: 'bold', color: '#64748b', letterSpacing: 0.5, textTransform: 'uppercase' },
    qContentText: { fontSize: 15, fontWeight: '600', color: '#0f172a', lineHeight: 24, marginBottom: 16 },

    optionsList: { gap: 10 },
    optBox: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1 },
    optBoxDefault: { backgroundColor: '#f8fafc', borderColor: '#f1f5f9' },
    optBoxUserCorrect: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
    optBoxUserWrong: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
    optBoxActualCorrect: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
    optText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 20 },
    optCircleDefault: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#cbd5e1' },

    tagChoice: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, marginRight: 8, maxWidth: '43%', alignItems: 'center', justifyContent: 'center' },
    tagChoiceText: { color: 'white', fontSize: 8, fontWeight: 'bold', textAlign: 'center', lineHeight: 10 },
    tagCorrectAnswerText: { fontSize: 11, fontWeight: 'bold', color: '#166534', marginRight: 8 },

    explanationBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: '#e2e8f0' },
    explanationText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18, marginLeft: 8 }
});