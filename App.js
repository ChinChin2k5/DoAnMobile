import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.mainScreen}>
    <View style={styles.container}>
      <Text style={styles.bigtitleText}>EduTest</Text>
      <Text style={styles.subText}>Hệ thống đánh giá năng lực trực tuyến</Text>
      <StatusBar style="auto" />
    </View>
    <View style={styles.card}>
      <Text style={styles.titleText}>Chào Mừng Bạn</Text>
      <Text style={styles.subText}>Đăng Nhập Hoặc Tạo Tài Khoản Để Bắt Đầu</Text>
      <View style={styles.minicard}>
        <TouchableOpacity style={styles.tabButtonActive}>
          <Text style={styles.tabTextActive}>Đăng Nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButtonInActive}>
          <Text style={styles.tabTextActive}>Đăng Ký</Text>
        </TouchableOpacity>
       </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1, 
    backgroundColor: '#E0F7FA', // Màu nền xanh nhạt của app EduTest
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'
  },
  minicard: {
    backgroundColor: 'gray',
    padding: 10,
    flexDirection: 'row',
    width: '100%',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  subText: {
    marginBottom: 20
  },
  bigtitleText: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },
  tabButtonActive: {
    flex: 1,
    alignItems: 'center',
  },
  tabButtonInActive: {
    flex: 1,
    alignItems: 'center'
  },
});

