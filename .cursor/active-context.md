> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `navigation\AppNavigator.js` (Domain: **Frontend (React/UI)**)

### 📐 Frontend (React/UI) Conventions & Fixes
- **[what-changed] what-changed in AppNavigator.js**: File updated (external): navigation/AppNavigator.js

Content summary (318 lines):
import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

// ── THÊM 3 IMPORT NÀY ĐỂ XỬ LÝ ĐĂNG XUẤT VÀ XÓA DỮ LIỆU
- **[what-changed] Updated API endpoint Loading**: -       initialRouteName="LoadingScreen"
+       initialRouteName="Loading"

📌 IDE AST Context: Modified symbols likely include [ClassesScreen, TeacherAdminPlaceholder, Stack, Tab, MainTabNavigator]
- **[what-changed] Updated API endpoint LoadingScreen**: -       initialRouteName="Loading"
+       initialRouteName="LoadingScreen"

📌 IDE AST Context: Modified symbols likely include [ClassesScreen, TeacherAdminPlaceholder, Stack, Tab, MainTabNavigator]
- **[decision] decision in CreateClass1Screen.js**: File updated (external): Screens_Duc/CreateClass1Screen.js

Content summary (206 lines):
// screens/CreateClass1Screen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateClass1Screen({ navigation }) {
  const [className, setClassName] = useState('');
  const [selectedColor, setSelectedColor] = 
- **[what-changed] what-changed in CreateExamStep1Screen.js**: File updated (external): Screens_Duc/CreateExamStep1Screen.js

Content summary (191 lines):
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

export default function CreateExamStep1Screen({ navigation }) {
  const { userName } = useContext(UserContext);
  const [examTitle, setExa
- **[what-changed] what-changed in CreateClass2Screen.js**: File updated (external): Screens_Duc/CreateClass2Screen.js

Content summary (207 lines):
// screens/CreateClass2Screen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
- **[what-changed] what-changed in DashboardScreen.js**: File updated (external): Screens_Duc/DashboardScreen.js

Content summary (295 lines):
// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

export default function DashboardScreen({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [totalStudents, s
- **[what-changed] what-changed in CreateExamStep3Screen.js**: File updated (external): Screens_Duc/CreateExamStep3Screen.js

Content summary (314 lines):
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, SafeAreaView, Alert, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTi
- **[what-changed] what-changed in ProfileScreen.js**: File updated (external): Screens_Duc/ProfileScreen.js

Content summary (385 lines):
// screens/ProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
- **[what-changed] what-changed in StudentsScreen.js**: File updated (external): Screens_Duc/StudentsScreen.js

Content summary (409 lines):
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function StudentsScreen({ navigation
- **[trade-off] trade-off in Button.js**: File updated (external): src/components/Button.js

Content summary (59 lines):
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
   
- **[what-changed] what-changed in Header.js**: File updated (external): src/components/Header.js

Content summary (123 lines):
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native"; 
import { MaterialIcons, Feather } from "@expo/vector-icons"; 
import { useNavigation } from "@react-navigation/native";

export default function Header({ 
  title = "Tiêu Đề", 
  leftIcon = "arrow-back", 
  showBell = true,         
  onLeftPress = false,             
}) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onLeftPress) {
    
- **[decision] decision in Dropdown.js**: File updated (external): src/components/Dropdown.js

Content summary (78 lines):
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const AppDropdown = ({ label, data, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconSt
- **[what-changed] what-changed in AppTextInput.js**: File updated (external): src/components/AppTextInput.js

Content summary (43 lines):
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const AppTextInput = ({ label, value, onChangeText, placeholder, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6F7F91"
        {...props}
      />
    </Vie
- **[what-changed] what-changed in AdminChartScreen.js**: File updated (external): src/screens/AdminChartScreen.js

Content summary (375 lines):
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
import { useTranslation } from "react-i18next
