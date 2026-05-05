import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Switch, TextInput, Alert, Platform, useWindowDimensions
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SummaryChip = ({ icon, label }) => (
    <View style={styles.chip}>
        <Ionicons name={icon} size={14} color="#3b82f6" />
        <Text style={styles.chipText}>{label}</Text>
    </View>
);

// BẮT ĐẦU HÀM CHÍNH
export default function Tao_De_Thi_Part2({ navigation, route }) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const { userRole, classCode, userName } = useContext(UserContext);
    const { examData } = route?.params || {};

    const totalQuestions = examData?.questions?.length || 1;

    const [examTitle, setExamTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [volume, setVolume] = useState(totalQuestions);

    const [allowRetake, setAllowRetake] = useState(false);
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [shuffleAnswers, setShuffleAnswers] = useState(false);
    const [antiCheating, setAntiCheating] = useState(false);

    const handleGenerateTest = async () => {
        if (!examTitle.trim()) {
            if (Platform.OS === 'web') {
                window.alert("Lỗi: Vui lòng nhập tên bài thi!");
            } else {
                Alert.alert("Lỗi", "Vui lòng nhập tên bài thi!");
            }
            return;
        }

        try {
            const finalExamData = {
                ...examData,
                title: examTitle.trim(),
                duration: duration,
                totalQuestions: totalQuestions,
                config: {
                    volume: volume,
                    rules: { shuffleQuestions, shuffleAnswers, antiCheating, allowRetake }
                },
                creatorName: userName || 'Học viên',
                role: userRole || 'student',
                createdAt: serverTimestamp(),
                status: 'active',
                targetClass: userRole === 'giảng viên' ? classCode : null
            };

            const docRef = await addDoc(collection(db, "exams"), finalExamData);

            const successMsg = userRole === 'giảng viên'
                ? "Đề thi đã được phát hành cho lớp!"
                : "Đã tạo đề thi thành công!";

            if (Platform.OS === 'web') {
                window.alert(successMsg + " Nhấn OK để vào thi ngay.");
                navigation.navigate('Man_Hinh_Lam_Bai', { examId: docRef.id });
            } else {
                Alert.alert(
                    "Thành công",
                    successMsg,
                    [{ text: "OK", onPress: () => navigation.navigate('Man_Hinh_Lam_Bai', { examId: docRef.id }) }]
                );
            }
        } catch (e) {
            console.error("Lỗi khi tạo đề: ", e);
            const errorMsg = "Không thể lưu đề thi. Vui lòng thử lại";
            if (Platform.OS === 'web') {
                window.alert("Lỗi: " + errorMsg);
            } else {
                Alert.alert("Lỗi", errorMsg);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={[styles.scrollContent, isDesktop && styles.desktopScrollContent]}>
                <View style={[styles.mainWrapper, isDesktop && styles.desktopWrapper]}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#1e293b" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Thiết lập đề thi</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Tên đề thi của bạn</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ví dụ: Kiểm tra cuối kỳ môn Sinh học..."
                            value={examTitle}
                            onChangeText={setExamTitle}
                        />
                    </View>

                    <View style={[styles.summaryCard, isDesktop && { flexDirection: 'row', flexWrap: 'wrap' }]}>
                        <SummaryChip icon="document-text" label={`${totalQuestions} Câu hỏi`} />
                        <SummaryChip icon="person" label={userName || "Học viên"} />
                        <SummaryChip icon="calendar" label="Hôm nay" />
                    </View>

                    <View style={isDesktop ? styles.desktopRow : null}>
                        <View style={[styles.configCard, isDesktop && { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.sectionTitle}>Thời gian làm bài</Text>
                            <Text style={styles.sliderValue}>{duration} phút</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={5}
                                maximumValue={180}
                                step={5}
                                value={duration}
                                onValueChange={setDuration}
                                minimumTrackTintColor="#3b82f6"
                                maximumTrackTintColor="#cbd5e1"
                            />
                        </View>

                        <View style={[styles.configCard, isDesktop && { flex: 1, marginLeft: 10 }]}>
                            <Text style={styles.sectionTitle}>Số lượng câu hỏi</Text>
                            <Text style={styles.sliderValue}>{volume} / {totalQuestions}</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1}
                                maximumValue={totalQuestions}
                                step={1}
                                value={volume}
                                onValueChange={setVolume}
                                minimumTrackTintColor="#10b981"
                                maximumTrackTintColor="#cbd5e1"
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Quy tắc phòng thi</Text>
                    <View style={[styles.rulesGrid, isDesktop && { flexDirection: 'row', flexWrap: 'wrap' }]}>
                        <RuleItem icon="shuffle" label="Xáo trộn câu hỏi" value={shuffleQuestions} onValueChange={setShuffleQuestions} isDesktop={isDesktop} />
                        <RuleItem icon="list" label="Xáo trộn đáp án" value={shuffleAnswers} onValueChange={setShuffleAnswers} isDesktop={isDesktop} />
                        <RuleItem icon="shield-checkmark" label="Chế độ chống gian lận" value={antiCheating} onValueChange={setAntiCheating} isDesktop={isDesktop} />
                        <RuleItem icon="refresh" label="Cho phép thi lại" value={allowRetake} onValueChange={setAllowRetake} isDesktop={isDesktop} />
                    </View>

                    <TouchableOpacity style={styles.finishBtn} onPress={handleGenerateTest}>
                        <Text style={styles.finishBtnText}>Tạo Đề Thi Ngay 🚀</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
// <-- DẤU NGOẶC ĐÓNG CỦA HÀM CHÍNH ĐÃ ĐƯỢC CHỐT Ở ĐÂY (TRÁNH LỖI SYNTAX)

const RuleItem = ({ icon, label, value, onValueChange, isDesktop }) => (
    <View style={[styles.ruleItem, isDesktop && { width: '48%', margin: '1%' }]}>
        <View style={styles.ruleLeft}>
            <Ionicons name={icon} size={20} color="#64748b" />
            <Text style={styles.ruleLabel}>{label}</Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ true: '#3b82f6' }} />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollContent: { paddingBottom: 40 },
    desktopScrollContent: { alignItems: 'center' },
    mainWrapper: { width: '100%', padding: 20 },
    desktopWrapper: { maxWidth: 900, backgroundColor: 'white', marginTop: 20, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
    backBtn: { padding: 8, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    inputSection: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 8 },
    input: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    summaryCard: { flexDirection: 'row', marginBottom: 20 },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', padding: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    chipText: { fontSize: 12, color: '#1e3a8a', fontWeight: 'bold', marginLeft: 5 },
    desktopRow: { flexDirection: 'row', justifyContent: 'space-between' },
    configCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
    sliderValue: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center' },
    rulesGrid: { marginBottom: 30 },
    ruleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' },
    ruleLeft: { flexDirection: 'row', alignItems: 'center' },
    ruleLabel: { fontSize: 15, color: '#334155', marginLeft: 12 },
    finishBtn: { backgroundColor: '#1e293b', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    finishBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});