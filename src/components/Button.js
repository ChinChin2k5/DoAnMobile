import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ButtonNice = ({ 
  text, 
  onPress, 
  iconName, 
  iconPosition = 'right', 
  customStyle, 
  customTextStyle,
  iconColor = "white", 
}) => {
  return (
    <TouchableOpacity style={[styles.buttonBetter,customStyle, customTextStyle]} onPress={onPress}>
      {iconPosition === 'left' && iconName && (
        <MaterialIcons
          name={iconName}
          size={20}
          color={iconColor}
          style={{ marginRight: 8 }} 
        />
      )}

      <Text style={[styles.textStyle,customTextStyle]}>{text}</Text>

      {iconPosition === 'right' && iconName && (
        <MaterialIcons
          name={iconName}
          size={20}
          color={iconColor}
          style={{ marginLeft: 8 }}
        />
      )}

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
