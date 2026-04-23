import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
//Em đang muốn khai báo các props cho biến Button này, đồng thời kích hoạt khả năng OnPress của Button
//Và em đang chọn Text là props duy nhất đảm nhận cái này
const ButtonNice = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonBetter} onPress={onPress}>
      <Text style={styles.textStyle}>{text}</Text>
      <Feather
        name="chevron-right"
        size={20}
        color="white"
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonBetter: {
    width: 300,
    height: 55,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 30,
    elevation: 3,
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
});
export default ButtonNice;
