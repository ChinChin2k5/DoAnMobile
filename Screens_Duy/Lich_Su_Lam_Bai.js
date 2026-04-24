// Screens_Duy/Lich_Su_Lam_Bai.js
import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Lich_Su_Lam_Bai({ navigation }) {
    const { userName } = useContext(UserContext);
    const [historyList, setHistoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "History"), orderBy("completedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const temps = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.studentName === userName) {
                    temps.push({
                        id: doc.id,
                        ...data,
                        dateStr: data.completedAt
                            ? new Date(data.completedAt.seconds * 1000).toLocaleString('vi-VN')
                            : 'Vừa xong'
                    });
                }
            });
            setHistoryList(temps);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userName]);

    const renderHistoryItem = ({ item }) => {
        const scoreColor = item.score >= 8 ? '#10b981' : (item.score >= 5 ? '#f59e0b' : '#ef4444');

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.examTitle} numberOfLines={1}>{item.examTitle}</Text>
                    <Text style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                        {item.score} đ
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#64748b" />
                        <Text style={styles.infoText}>Đúng: {item.correctCount}/{item.totalQuestions}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="timer-outline" size={16} color="#64748b" />
                        <Text style={styles.infoText}>T.gian: {Math.floor(item.timeTaken / 60)}p {item.timeTaken % 60}s</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.dateText}>Nộp lúc: {item.dateStr}</Text>
                </View>

                <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => navigation.navigate('Chi_Tiet_Dap_An', { resultData: item })}
                >
                    <Text style={styles.detailBtnText}>Xem chi tiết</Text>
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
                <View style={styles.center}><Text>Đang tải dữ liệu...</Text></View>
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
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 16, backgroundColor: 'white', elevation: 2, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 10, color: '#64748b', fontSize: 14 },

    card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    examTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', flex: 1, marginRight: 10 },
    scoreBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, color: 'white', fontWeight: 'bold', fontSize: 14 },

    infoRow: { flexDirection: 'row', marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
    infoText: { marginLeft: 4, color: '#475569', fontSize: 13 },

    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
    dateText: { color: '#94a3b8', fontSize: 12 },
    detailBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#eff6ff',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
    },
    detailBtnText: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold', }
});