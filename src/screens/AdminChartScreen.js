import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  Zap,
  ShieldCheck,
  FileText,
  Users,
  MoreHorizontal,
  Code,
} from "lucide-react-native";
import Header from "../components/Header";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useTranslation } from "react-i18next";
import StatCard from "../components/StatCard";
import Svg, { Circle } from "react-native-svg";

const getIconForDomain = (domainName) => {
  switch (domainName) {
    default:
      return <Code color="#084CCB" size={20} />;
  }
};

const AccuracyDonut = ({ rate, labelText }) => {
  const strokeDashoffset = 395.84 - (rate / 100) * 395.84;
  return (
    <View style={styles.donutContainer}>
      <View
        style={{
          width: 140,
          height: 140,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Svg
          width="140"
          height="140"
          style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
        >
          <Circle
            cx="70"
            cy="70"
            r="63"
            stroke="#F3F4F6"
            strokeWidth="14"
            fill="none"
          />
          <Circle
            cx="70"
            cy="70"
            r="63"
            stroke="#084CCB"
            strokeWidth="14"
            fill="none"
            strokeDasharray={395.84}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />
        </Svg>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.donutPercent}>{rate}%</Text>
          <Text style={styles.donutSubText}>{labelText}</Text>
        </View>
      </View>
    </View>
  );
};

// 2. COMPONENT CHÍNH QUẢN LÝ LOGIC
export default function ChartAdminScreen() {
  const { t } = useTranslation();

  const [chartData, setChartData] = useState({
    totalUsers: "0",
    totalExams: "0",
    newMembers: "0",
    onlineTime: "0",
  });
  const [topCourses, setTopCourses] = useState([]);
  const [accuracyRate, setAccuracyRate] = useState(0);

  const fetchChartStats = async () => {
    try {
      const docRef = doc(db, "SystemSettings", "DashboardStats");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChartData({
          totalUsers: data.totalActiveUsers?.toString() || "0",
          totalExams: data.totalExams?.toString() || "0",
          newMembers: data.totalExamsToday?.toString() || "0",
          onlineTime: data.storageUsagePercentage || 10,
        });
      }

      const examsSnapshot = await getDocs(collection(db, "exams"));
      let totalExamsCount = 0;
      let domainCounts = {};

      examsSnapshot.forEach((examDoc) => {
        const examData = examDoc.data();

        // 2. CHUI VÀO TRONG MẢNG QUESTIONS ĐỂ LẤY DOMAIN RA!!!
        const questions = examData.questionsList || examData.questions || [];

        questions.forEach((q) => {
          if (q.domain) {
            domainCounts[q.domain] = (domainCounts[q.domain] || 0) + 1;
            totalExamsCount++; // Đếm dựa trên số câu hỏi có domain
          }
        });
      });

      if (totalExamsCount > 0) {
        const sortedCourses = Object.keys(domainCounts)
          .map((domainName) => {
            const count = domainCounts[domainName];
            return {
              name: domainName,
              count: count,
              percent: Math.round((count / totalExamsCount) * 100),
            };
          })
          .sort((a, b) => b.percent - a.percent)
          .slice(0, 3);

        const finalTopCourses = sortedCourses.map((course, index) => ({
          id: index + 1,
          name: course.name,
          percent: course.percent,
          icon: getIconForDomain(course.name),
        }));
        setTopCourses(finalTopCourses);
      }

      const historySnapshot = await getDocs(collection(db, "History"));
      let totalCorrectAll = 0;
      let totalQuestionsAll = 0;

      historySnapshot.forEach((doc) => {
        const historyData = doc.data();
        if (
          typeof historyData.correctCount === "number" &&
          typeof historyData.totalQuestions === "number"
        ) {
          totalCorrectAll += historyData.correctCount;
          totalQuestionsAll += historyData.totalQuestions;
        }
      });

      if (totalQuestionsAll > 0) {
        const avgAccuracy = Math.round(
          (totalCorrectAll / totalQuestionsAll) * 100
        );
        setAccuracyRate(avgAccuracy);
      }
    } catch (error) {
      console.error("Lỗi kéo data thống kê:", error);
    }
  };

  useEffect(() => {
    fetchChartStats();
  }, []);

  // GIỮ NGUYÊN I18N, CHỈ THÊM THUỘC TÍNH iconBg CHO STATCARD
  const analyticsStats = [
    {
      id: 1,
      title: t("chartAdmin_totalUsers"),
      value: chartData.totalUsers,
      icon: <Users color="#084CCB" size={20} />,
      iconBg: "#E8EFFB",
      badge: { text: "+12%", type: "success" },
    },
    {
      id: 2,
      title: t("chartAdmin_totalExams"),
      value: chartData.totalExams,
      icon: <FileText color="#084CCB" size={20} />,
      iconBg: "#E8EFFB",
      badge: { text: "+8%", type: "success" },
    },
    {
      id: 3,
      title: t("chartAdmin_activeSessions"),
      value: chartData.newMembers,
      icon: <Zap color="#084CCB" size={20} />,
      iconBg: "#FEF2F2",
      badge: { text: "-2%", type: "danger" },
    },
    {
      id: 4,
      title: t("chartAdmin_systemHealth"),
      value: `${chartData.onlineTime}`,
      icon: <ShieldCheck color="#084CCB" size={20} />,
      iconBg: "#E8EFFB",
      badge: { text: "+24%", type: "success" },
    },
  ];

  return (
    <ScreenWrapper backgroundColor="#D3E4FE">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Header
          title={t("chartAdmin_headerTitle")}
          leftIcon="arrow-back"
          showBell={true}
        />
        <View style={styles.headerDivider} />

        <View style={styles.body}>
          {/* PHẦN 1: 4 THẺ THỐNG KÊ ĐƯỢC TỐI ƯU VỚI COMPONENT STATCARD  */}
          {analyticsStats.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}

          {/* PHẦN 2: TOP COURSE CATEGORIES */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t("chartAdmin_topCoursesTitle")}
              </Text>
              <MoreHorizontal color="#6F7F91" size={20} />
            </View>

            {topCourses.map((course) => (
              <View key={course.id} style={styles.courseRow}>
                <View style={styles.iconWrapper}>{course.icon}</View>
                <View style={styles.courseInfo}>
                  <View style={styles.courseTextRow}>
                    {/* BỌC HÀM t() VÀO ĐÂY VÀ DÙNG TUYỆT KỸ defaultValue */}
                    <Text style={styles.courseName}>
                      {t(`subjects.${course.name}`, {
                        defaultValue: course.name,
                      })}
                    </Text>

                    <Text style={styles.coursePercent}>{course.percent}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${course.percent}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* PHẦN 3: GỌI DONUT RA ĐÂY CHO GỌN GÀNG MÀ VẪN GIỮ ĐƯỢC I18N */}
          <View style={styles.sectionCard}>
            <AccuracyDonut
              rate={accuracyRate}
              labelText={t("chartAdmin_accuracyLabel")}
            />

            <Text style={styles.retentionTitle}>
              {t("chartAdmin_accuracyTitle")}
            </Text>
            <Text style={styles.retentionDesc}>
              {t("chartAdmin_accuracyDesc")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 10 },

  // Giữ lại cái này cho phần Top Course
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8EFFB",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#1A2134",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter-Black", color: "#1A2134" },

  courseRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  courseInfo: { flex: 1, marginLeft: 16 },
  courseTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  courseName: { fontSize: 14, fontFamily: "Inter-Bold", color: "#1A2134" },
  coursePercent: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: "#6F7F91",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 100,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#084CCB",
    borderRadius: 100,
  },

  donutContainer: {
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 24,
  },
  donutPercent: { fontSize: 28, fontFamily: "Inter-Black", color: "#1A2134" },
  donutSubText: {
    fontSize: 9,
    fontFamily: "Inter-Bold",
    color: "#6F7F91",
    letterSpacing: 1,
    marginTop: 0,
  },

  retentionTitle: {
    fontSize: 16,
    fontFamily: "Inter-Black",
    color: "#1A2134",
    textAlign: "center",
    marginBottom: 8,
  },
  retentionDesc: {
    fontSize: 13,
    fontFamily: "Inter-Medium",
    color: "#6F7F91",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
});
