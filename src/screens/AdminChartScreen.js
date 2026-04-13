import React from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
// Lấy chiều rộng màn hình thiết bị
const screenWidth = Dimensions.get("window").width;

export default function AdminChartScreen() {
  // 1. TÁCH RIÊNG DATA: Dễ dàng Fetch từ API nhét vào đây sau này
  const chartData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  // 2. TÁCH RIÊNG CONFIG UI: Code nhìn gọn gàng, sạch sẽ
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Fix lỗi chữ trục X/Y bị tàng hình
    barPercentage: 0.6, // Cho cột béo lên một chút nhìn cho cân đối
    fillShadowGradientOpacity: 1, // Màu cột đậm đà 100%
  };
  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView>
        <Header backgroundColor="ffffff"></Header>
        <View style={styles.container}>
          {/* Tiêu đề của Biểu đồ */}
          <Text style={styles.title}>Thống Kê Đơn Hàng Trong Tuần</Text>

          {/* Component Biểu đồ */}
          <BarChart
            data={chartData}
            // Trừ đi 32px (16px mỗi bên lề) để UI có không gian thở, chuẩn chỉnh OCD!
            width={screenWidth - 32}
            height={240}
            yAxisLabel=""
            yAxisSuffix=" đơn"
            chartConfig={chartConfig}
            fromZero={true}
            showValuesOnTopOfBars={true} // Trick xịn: Hiển thị luôn con số trên đỉnh cột
            style={styles.chartStyle}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

// 3. CSS ĐỂ GIAO DIỆN VUÔNG VỨC
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    marginHorizontal: 16, // Đẩy lề 2 bên
    borderRadius: 16, // Bo góc toàn khối
    // Đổ bóng nhẹ cho Card nhìn nổi bật (Tùy chọn)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  chartStyle: {
    borderRadius: 16, // Bo góc cho cái nền của biểu đồ
  },
});
