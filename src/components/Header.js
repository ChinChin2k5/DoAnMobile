import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function Header() {
    const navigation = useNavigation();
    return (
      <View style={[styles.header, styles.globalPadding, styles.globalBetween]}>
        {/* Cụm bên trái */}
        <TouchableOpacity
          style={styles.row} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="black" />
          <Text style={styles.boldText}>Quay Lại</Text>
        </TouchableOpacity>
  
        <View style={styles.row}>
          <View style={styles.textGroup}>
            <Text style={styles.lightText}>Xin Chào</Text>
            <Text style={styles.boldText}>Admin System</Text>
          </View>
  
          <View style={styles.circle}>
              <Text style={styles.text}>A</Text>
          </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    globalPadding: { paddingHorizontal: 15 },
    globalBetween: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
    },
    header: { marginTop: 10 },
    row: { 
      flexDirection: "row", 
      alignItems: "center", 
      gap: 10 
    },
    textGroup: {
      alignItems: "flex-end", // Chữ căn lề phải cho đẹp theo chuẩn Header
    },
    boldText: { fontWeight: "bold" },
    lightText: { fontSize: 12, color: '#666' },
    circle: {
      width: 40, 
      height: 40, 
      borderRadius: 20, // 50 / 2
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'violet',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    }
  });