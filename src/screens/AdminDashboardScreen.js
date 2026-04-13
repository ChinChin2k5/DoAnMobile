import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { Users, FileText, Activity, Shield } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

export default function AdminDashboardScreen() {
  // Data nên được tách ra ngoài hàm return
  const navigation = useNavigation();
  const stats = [
    {
      id: 1,
      title: "Tổng người dùng",
      value: "1.234",
      sub: "156 giáo viên, 1078 học sinh",
      icon: <Users color="#10B981" size={24} />,
    },
    {
      id: 2,
      title: "Tổng đề thi",
      value: "856",
      sub: "48 đang hoạt động",
      icon: <FileText color="#10B981" size={24} />,
    },
    {
      id: 3,
      title: "Bài thi hôm nay",
      value: "342",
      sub: "128 đang diễn ra",
      icon: <Activity color="#A855F7" size={24} />,
    },
    {
      id: 4,
      title: "Hệ thống",
      value: "99.8%",
      sub: "Hoạt động bình thường",
      icon: <Shield color="#F97316" size={24} />,
    },
  ];

  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header backgroundColor="white"></Header>
        {/* Body */}
        <View style={[styles.body, styles.globalPadding]}>
          <View>
            <Text style={[styles.boldText, styles.dashBoard]}>
              Dashboard Quản Trị Viên
            </Text>
            <Text style={styles.miniDashBoard}>
              Quản lý và giám sát toàn bộ hệ thống
            </Text>
          </View>

          <View style={styles.navButtonsContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate("ConfigAdmin")}
            >
              <Text style={styles.button}>⚙️ Cài Đặt Hệ Thống</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.buttonStyle} // Đổi màu xanh lá cho khác biệt
            onPress={() => navigation.navigate("ChartAdmin")}
          >
            <Text style={styles.button}>📊 Xem Thống Kê</Text>
          </TouchableOpacity>

          {/* Render Stats Cards */}
          {stats.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.icon}
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.subText}>{item.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// Giữ nguyên đống Styles của em
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  body: { marginTop: 20, backgroundColor: "#E0E0E0", padding: 20 },
  dashBoard: { fontSize: 24 },
  miniDashBoard: { fontSize: 12 },
  button: { fontSize: 18, color: "white" },
  buttonStyle: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#007BFF",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  title: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subText: { fontSize: 12, color: "#9CA3AF" },
});
