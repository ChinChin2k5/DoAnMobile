// Screens_Duy/Lich_Su_Lam_Bai.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Animated, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
//file này có tác dụng hiển thị lịch sử làm bài của thí sinh, lấy dữ liệu từ Firestore dựa trên uid của người dùng hiện tại, sắp xếp theo thời gian hoàn thành (completedAt) giảm dần để hiển thị bài làm mới nhất lên đầu, và cung cấp giao diện đẹp mắt với thông tin chi tiết về từng bài làm như tên đề thi, điểm số, số câu đúng/sai, thời gian làm bài, và ngày nộp bài. Ngoài ra còn có tính năng xem chi tiết đáp án của từng bài làm thông qua nút "Xem chi tiết đáp án"-truy cập vào Chi_Tiet_Dap_An và truyền dữ liệu kết quả qua params để hiển thị chi tiết đáp án và phân tích bài làm.
// ─────────────────────────────────────────────
// Skeleton Component cho Lịch Sử Làm Bài
// ─────────────────────────────────────────────
const SkeletonHistoryCard = () => {
    const pulseAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0.5, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, [pulseAnim]);

    return (
        <Animated.View style={[styles.card, { opacity: pulseAnim }]}>
            <View style={[styles.cardHeader, { marginBottom: 15 }]}>
                <View style={{ height: 18, backgroundColor: '#e2e8f0', borderRadius: 4, width: '60%' }} />
                <View style={{ height: 26, backgroundColor: '#e2e8f0', borderRadius: 8, width: 50 }} />
            </View>
            <View style={styles.infoRow}>
                <View style={{ height: 16, backgroundColor: '#e2e8f0', borderRadius: 4, width: 100, marginRight: 20 }} />
                <View style={{ height: 16, backgroundColor: '#e2e8f0', borderRadius: 4, width: 100 }} />
            </View>
            <View style={[styles.footerRow, { marginTop: 5 }]}>
                <View style={{ height: 14, backgroundColor: '#e2e8f0', borderRadius: 4, width: 150 }} />
            </View>
            <View style={{ height: 34, backgroundColor: '#e2e8f0', borderRadius: 8, width: '100%', marginTop: 10 }} />
        </Animated.View>
    );
};

export default function Lich_Su_Lam_Bai({ navigation }) {
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) { setIsLoading(false); return; }

        const startTime = Date.now(); // ← chốt mốc thời gian
        const MIN_LOADING = 1000;
        let isFirstLoad = true;

        // Query theo uid — khớp Firestore rule, không cần lọc client-side
        // ⚠️  Lần đầu chạy Firestore sẽ log link tạo composite index
        //     (uid ASC + completedAt DESC) — bấm link đó 1 lần là xong.
        const q = query(
            collection(db, 'History'),
            where('uid', '==', uid),
            orderBy('completedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const temps = snapshot.docs.map(doc => {
                const data = doc.data();
                const scoreOn10 = (data.totalQuestions > 0 && data.correctCount != null)
                    ? Math.round((data.correctCount / data.totalQuestions) * 100) / 10
                    : (data.score ?? 0);
                return {
                    id: doc.id,
                    ...data,
                    score: scoreOn10,
                    dateStr: data.completedAt
                        ? new Date(data.completedAt.seconds * 1000).toLocaleString('vi-VN')
                        : 'Vừa xong',
                };
            });
            
            setHistoryList(temps);

            // Kiểm tra thời gian load cho lần gọi đầu tiên
            if (isFirstLoad) {
                const elapsed = Date.now() - startTime;
                const remain = Math.max(0, MIN_LOADING - elapsed);
                setTimeout(() => setIsLoading(false), remain);
                isFirstLoad = false;
            }
            
        }, (error) => {
            console.error('[Lich_Su] Snapshot error:', error.message);
            if (isFirstLoad) {
                const elapsed = Date.now() - startTime;
                const remain = Math.max(0, MIN_LOADING - elapsed);
                setTimeout(() => setIsLoading(false), remain);
                isFirstLoad = false;
            }
        });

        return () => unsubscribe();
    }, []); // uid không đổi trong session → deps [] là đúng

    const renderHistoryItem = ({ item }) => {
        const scoreColor = item.score >= 8 ? '#10b981' : (item.score >= 5 ? '#f59e0b' : '#ef4444');
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.examTitle} numberOfLines={1}>{item.examTitle}</Text>
                    <Text style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                        {typeof item.score === 'number' ? item.score.toFixed(1) : item.score} đ
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#64748b" />
                        <Text style={styles.infoText}>Đúng: {item.correctCount}/{item.totalQuestions}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="timer-outline" size={16} color="#64748b" />
                        <Text style={styles.infoText}>
                            T.gian: {Math.floor((item.timeTaken ?? 0) / 60)}p {(item.timeTaken ?? 0) % 60}s
                        </Text>
                    </View>
                </View>
                <View style={styles.footerRow}>
                    <Text style={styles.dateText}>Nộp lúc: {item.dateStr}</Text>
                </View>
                <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('Chi_Tiet_Dap_An', { resultData: item })}
                >
                    <Text style={styles.detailBtnText}>Xem chi tiết đáp án</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lịch sử làm bài</Text>
            </View>
            
            {isLoading ? (
                <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                    <SkeletonHistoryCard />
                    <SkeletonHistoryCard />
                    <SkeletonHistoryCard />
                    <SkeletonHistoryCard />
                </ScrollView>
            ) : historyList.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
                    <Text style={styles.emptyText}>Chưa có bài kiểm tra nào được hoàn thành.</Text>
                </View>
            ) : (
                <FlatList
                    data={historyList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderHistoryItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8fafc', 
        paddingBottom: 60 
    },
    header: { 
        padding: 16, 
        backgroundColor: 'white', 
        elevation: 2, 
        alignItems: 'center' 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#0f172a' 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    emptyText: { 
        marginTop: 10, 
        color: '#64748b', 
        fontSize: 14, 
        textAlign: 'center', 
        paddingHorizontal: 32 
    },
    card: { 
        backgroundColor: 'white', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 12, 
        elevation: 1 
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    examTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', flex: 1, marginRight: 10 },
    scoreBadge: { 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8, 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    infoRow: { flexDirection: 'row', marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    infoText: { marginLeft: 4, color: '#475569', fontSize: 13 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
    dateText: { color: '#94a3b8', fontSize: 12 },
    detailBtn: { 
        paddingVertical: 8, 
        paddingHorizontal: 12, 
        backgroundColor: '#eff6ff', 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        alignSelf: 'center', 
        marginTop: 10 
    },
    detailBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: 'bold' },
});