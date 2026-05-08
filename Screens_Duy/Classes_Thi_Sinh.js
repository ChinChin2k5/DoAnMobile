// Screens_Duy/Classes_Thi_Sinh.js
// Tab "Lớp học" trong MainTabNavigator
// Hiện tại: UI placeholder đẹp, sẵn sàng kết nối Firestore sau

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ── Dữ liệu mẫu — thay bằng fetch Firestore khi có collection "Classes" ──
const MOCK_CLASSES = [
    {
        id: '1',
        name: 'Toán lớp 10',
        teacher: 'GV. Nguyễn Văn B',
        totalExams: 5,
        color: '#dbeafe',
        iconColor: '#3b82f6',
        icon: 'calculator-outline',
    },
    {
        id: '2',
        name: 'Vật lý cơ bản',
        teacher: 'GV. Trần Thị C',
        totalExams: 3,
        color: '#ede9fe',
        iconColor: '#7c3aed',
        icon: 'flash-outline',
    },
    {
        id: '3',
        name: 'Hóa học đại cương',
        teacher: 'GV. Lê Văn D',
        totalExams: 4,
        color: '#dcfce7',
        iconColor: '#16a34a',
        icon: 'flask-outline',
    },
];

const COMING_SOON_FEATURES = [
    { icon: 'people-outline', label: 'Tham gia lớp học bằng mã' },
    { icon: 'calendar-outline', label: 'Lịch học & nhắc nhở' },
    { icon: 'chatbubbles-outline', label: 'Thảo luận với giáo viên' },
    { icon: 'trophy-outline', label: 'Bảng xếp hạng lớp' },
];

export default function Classes_Thi_Sinh({ navigation }) {
    const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'upcoming'

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Lớp học của tôi</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => { }}>
                    <Ionicons name="add" size={22} color="#3b82f6" />
                </TouchableOpacity>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'classes' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('classes')}
                >
                    <Text style={[styles.tabBtnText, activeTab === 'classes' && styles.tabBtnTextActive]}>
                        Đang học
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabBtnText, activeTab === 'upcoming' && styles.tabBtnTextActive]}>
                        Sắp ra mắt
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {activeTab === 'classes' ? (
                    <>
                        {/* Danh sách lớp mẫu */}
                        {MOCK_CLASSES.map(cls => (
                            <TouchableOpacity
                                key={cls.id}
                                style={styles.classCard}
                                activeOpacity={0.8}
                                onPress={() => {
                                    // TODO: navigate sang chi tiết lớp khi có screen
                                }}
                            >
                                <View style={[styles.classIcon, { backgroundColor: cls.color }]}>
                                    <Ionicons name={cls.icon} size={26} color={cls.iconColor} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.className}>{cls.name}</Text>
                                    <Text style={styles.classTeacher}>{cls.teacher}</Text>
                                    <View style={styles.classMetaRow}>
                                        <Ionicons name="document-text-outline" size={13} color="#94a3b8" />
                                        <Text style={styles.classMeta}>{cls.totalExams} đề thi</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                        ))}

                        {/* Banner tham gia lớp */}
                        <TouchableOpacity style={styles.joinBanner} activeOpacity={0.8}>
                            <View style={styles.joinBannerLeft}>
                                <Ionicons name="key-outline" size={22} color="#3b82f6" />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.joinTitle}>Tham gia lớp mới</Text>
                                    <Text style={styles.joinSub}>Nhập mã lớp từ giáo viên</Text>
                                </View>
                            </View>
                            <Ionicons name="arrow-forward-circle-outline" size={26} color="#3b82f6" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* Coming soon */}
                        <View style={styles.comingSoonCard}>
                            <Ionicons name="rocket-outline" size={48} color="#bfdbfe" style={{ marginBottom: 12 }} />
                            <Text style={styles.comingSoonTitle}>Tính năng đang phát triển</Text>
                            <Text style={styles.comingSoonSub}>
                                Chúng tôi đang xây dựng thêm nhiều tính năng học tập tuyệt vời cho bạn.
                            </Text>
                        </View>
                        {COMING_SOON_FEATURES.map((f, i) => (
                            <View key={i} style={styles.featureRow}>
                                <View style={styles.featureIcon}>
                                    <Ionicons name={f.icon} size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.featureLabel}>{f.label}</Text>
                                <View style={styles.soonBadge}>
                                    <Text style={styles.soonText}>Sắp ra mắt</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: Platform.OS === 'android' ? 60 : 60, paddingBottom: 60 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
    addBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },

    tabRow: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#f1f5f9', borderRadius: 14, padding: 4, marginBottom: 16 },
    tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
    tabBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    tabBtnText: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
    tabBtnTextActive: { color: '#1d4ed8' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    classCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
    classIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    className: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 3 },
    classTeacher: { fontSize: 13, color: '#64748b', marginBottom: 4 },
    classMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    classMeta: { fontSize: 12, color: '#94a3b8' },

    joinBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#eff6ff', borderRadius: 18, padding: 18, marginTop: 4, borderWidth: 1.5, borderColor: '#bfdbfe', borderStyle: 'dashed' },
    joinBannerLeft: { flexDirection: 'row', alignItems: 'center' },
    joinTitle: { fontSize: 15, fontWeight: '700', color: '#1d4ed8' },
    joinSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

    comingSoonCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    comingSoonTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
    comingSoonSub: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 },

    featureRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
    featureIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    featureLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1e293b' },
    soonBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    soonText: { fontSize: 11, fontWeight: '700', color: '#d97706' },
});