import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Switch, Image, TextInput
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SummaryChip = ({ icon, label }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
        <Ionicons name={icon} size={14} color="#3b82f6" />
        <Text style={{ fontSize: 12, color: '#1e3a8a', fontWeight: 'bold', marginLeft: 5 }}>{label}</Text>
    </View>
);

export default function Tao_De_Thi_Part2({ navigation, route }) {
    const { userRole, classCode, userName } = useContext(UserContext);

    const { examContent } = route?.params || {};
    const totalQuestions = examContent?.questions?.length || 1;
    const sourceType = examContent?.sourceType || 'manual';
    const domain = examContent?.domain || 'N/A';

    // --- STATE MỚI ---
    const [examTitle, setExamTitle] = useState(''); // Tên bài thi
    const [allowRetake, setAllowRetake] = useState(false); // Cho phép làm lại
    
    // --- STATE CẤU HÌNH CŨ ---
    const [volume, setVolume] = useState(totalQuestions);
    const [duration, setDuration] = useState(30);
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [shuffleAnswers, setShuffleAnswers] = useState(false);
    const [antiCheating, setAntiCheating] = useState(false);

    const handleGenerateTest = async () => {
        if (!examTitle.trim()) {
            alert("Vui lòng nhập tên bài thi!");
            return;
        }

        try {
            const finalExamData = {
                ...examContent,
                title: examTitle, // Lưu tên bài thi vào DB
                config: {
                    volume: volume,
                    duration: duration,
                    rules: { shuffleQuestions, shuffleAnswers, antiCheating, allowRetake } // Lưu thêm rule làm lại
                },
                author: userName,
                role: userRole,
                createdAt: serverTimestamp(),
                status: userRole === 'giảng viên' ? 'PUBLISHED' : 'PRIVATE',
                targetClass: userRole === 'giảng viên' ? classCode : null
            };

            await addDoc(collection(db, "Exams"), finalExamData);
            alert(userRole === 'giảng viên' ? "🚀 Đề thi đã được phát hành cho lớp!" : "✅ Đã lưu vào bộ đề cá nhân!");
            navigation.navigate('MainTabs', { screen: 'Dashboard' });
        } catch (e) {
            console.error("Lỗi khi tạo đề: ", e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Practice Test</Text>
                <View style={styles.avatarMini} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
                <Text style={styles.mainTitle}>Configuration</Text>
                <Text style={styles.subTitle}>Fine-tune your session parameters for optimal study results.</Text>

                {/* --- NHẬP TÊN BÀI THI --- */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
                        <Text style={styles.cardLabel}>EXAM TITLE / TÊN BÀI THI</Text>
                    </View>
                    <TextInput
                        style={styles.textInputFull}
                        placeholder="VD: Kiểm tra 15 phút Toán học..."
                        value={examTitle}
                        onChangeText={setExamTitle}
                    />
                </View>

                {/* --- QUESTION VOLUME --- */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="help-circle-outline" size={20} color="#3b82f6" />
                        <Text style={styles.cardLabel}>QUESTION VOLUME (Tối đa: {totalQuestions})</Text>
                    </View>
                    <View style={styles.volumeRow}>
                        <Text style={styles.volumeValue}>{volume}</Text>
                        <Text style={styles.volumeUnit}>items</Text>
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={1}
                        maximumValue={totalQuestions}
                        step={1}
                        value={volume}
                        onValueChange={setVolume}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="#cbd5e1"
                        thumbTintColor="#1e3a8a"
                    />
                </View>

                {/* --- TIME LIMIT (DURATION) --- */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="time-outline" size={20} color="#f59e0b" />
                        <Text style={styles.cardLabel}>TIME LIMIT (MINUTES)</Text>
                    </View>
                    <View style={styles.volumeRow}>
                        <TextInput
                            style={styles.editableValue}
                            keyboardType="numeric"
                            value={duration.toString()}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9]/g, '');
                                setDuration(numericText === '' ? 0 : parseInt(numericText, 10));
                            }}
                            onBlur={() => {
                                let finalVal = parseInt(duration, 10);
                                if (isNaN(finalVal) || finalVal < 5) finalVal = 5;
                                if (finalVal > 120) finalVal = 120;
                                setDuration(finalVal);
                            }}
                        />
                        <Text style={styles.volumeUnit}>mins</Text>
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={5}
                        maximumValue={120}
                        step={5}
                        value={duration}
                        onValueChange={setDuration}
                        minimumTrackTintColor="#f59e0b"
                        maximumTrackTintColor="#cbd5e1"
                        thumbTintColor="#b45309"
                    />
                </View>

                {/* --- EXAM RULES --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Exam Rules</Text>
                    <View style={styles.advancedBadge}><Text style={styles.advancedText}>ADVANCED</Text></View>
                </View>

                <View style={styles.rulesCard}>
                    <RuleItem icon="shuffle" title="Đảo câu hỏi" sub="Shuffle Questions" value={shuffleQuestions} onValueChange={setShuffleQuestions} />
                    <RuleItem icon="swap-horizontal" title="Đảo vị trí đáp án" sub="Shuffle Answers" value={shuffleAnswers} onValueChange={setShuffleAnswers} />
                    <RuleItem icon="shield-checkmark" title="Chống gian lận" sub="Anti-cheating Mode" value={antiCheating} onValueChange={setAntiCheating} />
                    <RuleItem icon="refresh-outline" title="Cho phép làm lại" sub="Allow Retake (Nhiều lần)" value={allowRetake} onValueChange={setAllowRetake} />
                </View>

                <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateTest}>
                    <Text style={styles.generateBtnText}>Generate Test 🚀</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const RuleItem = ({ icon, title, sub, value, onValueChange }) => (
    <View style={styles.ruleItem}>
        <View style={styles.ruleIconBox}><Ionicons name={icon} size={22} color="#3b82f6" /></View>
        <View style={styles.ruleContent}>
            <Text style={styles.ruleTitleText}>{title}</Text>
            <Text style={styles.ruleSubText}>{sub}</Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#cbd5e1", true: "#3b82f6" }} />
    </View>
);

// CSS rút gọn (Thêm style cho textInputFull)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
    avatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#333' },
    scrollBody: { padding: 20 },
    mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
    subTitle: { color: '#64748b', marginVertical: 10, lineHeight: 20 },
    card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 1 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    cardLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748b', marginLeft: 8 },
    textInputFull: { backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, fontSize: 16, color: '#0f172a', marginTop: 10 },
    volumeRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10, width: '100%' },
    volumeValue: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a' },
    editableValue: { fontSize: 32, fontWeight: 'bold', color: '#f59e0b', borderBottomWidth: 2, borderBottomColor: '#fcd34d', paddingVertical: 0, minWidth: 60, textAlign: 'center' },
    volumeUnit: { fontSize: 14, color: '#64748b', marginLeft: 8 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    advancedBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    advancedText: { fontSize: 9, fontWeight: 'bold', color: '#3b82f6' },
    rulesCard: { backgroundColor: 'white', borderRadius: 20, padding: 10, elevation: 1 },
    ruleItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    ruleIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f0f7ff', justifyContent: 'center', alignItems: 'center' },
    ruleContent: { flex: 1, marginLeft: 15 },
    ruleTitleText: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
    ruleSubText: { fontSize: 11, color: '#94a3b8' },
    generateBtn: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 25, marginBottom: 40 },
    generateBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});