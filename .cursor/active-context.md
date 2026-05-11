> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `Screens_Duy\Login.js` (Domain: **Frontend (React/UI)**)

### 🔴 Frontend (React/UI) Gotchas
- **gotcha in Login.js**: File updated (external): Screens_Duy/Login.js

Content summary (758 lines):
// screens/Login.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions,
    Image, Animated, ActivityIndicator, Modal, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

//  Import AsyncStorage để lưu session Role Admin
import AsyncStorage from '@re
- **gotcha in Profile_Thi_Sinh.js**: File updated (external): Screens_Duy/Profile_Thi_Sinh.js

Content summary (1360 lines):
// Screens_Duy/Profile_Thi_Sinh.js
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Image, Animated, Alert, Platform,
  Modal, TextInput, KeyboardAvoidingView, Linking,
  RefreshControl, ToastAndroid,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
/
- **⚠️ GOTCHA: Fixed null crash in Date — avoids unnecessary re-renders in React**: -         ...doc.data() }));
+         ...doc.data() 
- 
+       }));
-       // Chỉ giữ exam thuộc về user này (theo uid ưu tiên, fallback creatorName)
+ 
-       // hoặc exam được giao cho lớp của user
+       // Chỉ giữ exam thuộc về user này (theo uid ưu tiên, fallback creatorName)
-       const owned = list.filter(ex =>
+       // hoặc exam được giao cho lớp của user
-         ex.creatorUid === uid ||
+       const owned = list.filter(ex =>
-         (!ex.creatorUid && ex.creatorName === userName) ||
+         ex.creatorUid === uid ||
-         (classCode && ex.targetClass === classCode)
+         (!ex.creatorUid && ex.creatorName === userName) ||
-       );
+         (classCode && ex.targetClass === classCode)
-       //khi data về, nếu chưa đủ 1s thì delay thêm để đủ MIN_LOADING
+       );
-       setExams(owned);
+       //khi data về, nếu chưa đủ 1s thì delay thêm để đủ MIN_LOADING
-       const elapsed = Date.now() - startTime; // đã mất bao lâu?
+       setExams(owned);
-       const remain = Math.max(0, MIN_LOADING - elapsed); // còn thiếu bao nhiêu?
+       const elapsed = Date.now() - startTime; // đã mất bao lâu?
-       setTimeout(() => {
+       const remain = Math.max(0, MIN_LOADING - elapsed); // còn thiếu bao nhiêu?
-         setLoading(false);
+       setTimeout(() => {
-         clearTimeout(timeout); // hủy safety net vì đã xử lý xong
+         setLoading(false);
-       }, remain);
+         clearTimeout(timeout); // hủy safety net vì đã xử lý xong
-     }, (err) => {
+       }, remain);
-       console.error('[Dashboard] Firestore error:', err.message);
+     }, (err) => {
-       setLoading(false);
+       console.error('[Dashboard] Firestore error:', err.message);
-       clearTimeout(timeout);
+       setLoading(false);
-     });
+       clearTimeout(timeout);
- 
+     });
-     return () => { unsubscribe(); clearTimeout(timeout); };
+ 
-   }, [userName, classCode]);
+     return () => { un
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [DURATION_OPTIONS, QUESTIONS_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS, SkeletonItem]

### 📐 Frontend (React/UI) Conventions & Fixes
- **[what-changed] 🟢 Edited Screens_Duy/Lich_Su_Lam_Bai.js (68 changes, 1min)**: Active editing session on Screens_Duy/Lich_Su_Lam_Bai.js.
68 content changes over 1 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (598 changes, 10min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
598 content changes over 10 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (107 changes, 19min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
107 content changes over 19 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/TestScreen.js (315 changes, 1min)**: Active editing session on Screens_Duy/TestScreen.js.
315 content changes over 1 minutes.
- **[what-changed] what-changed in Classes_Thi_Sinh.js**: File updated (external): Screens_Duy/Classes_Thi_Sinh.js

Content summary (186 lines):
// Screens_Duy/Classes_Thi_Sinh.js
// Tab "Lớp học" trong MainTabNavigator
// Hiện tại: UI placeholder đẹp, sẵn sàng kết nối Firestore sau

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ── Dữ liệu mẫu — thay bằng fetch Firestore khi có collection "Classes" ──
const MOCK_CLASSES = [
    {
        id: '1',
        name: '
- **[what-changed] what-changed in Chi_Tiet_Dap_An.js**: File updated (external): Screens_Duy/Chi_Tiet_Dap_An.js

Content summary (370 lines):
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView,
    TouchableOpacity, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ==[REDACTED]
// 1. COMPONENT SKELETON CHỚP TẮT
// ==[REDACTED]
const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
    const opacity = useRef(new Animated.Value(0.4)).current;

   
- **[what-changed] what-changed in Ket_Qua_Va_Phan_Tich.js**: File updated (external): Screens_Duy/Ket_Qua_Va_Phan_Tich.js

Content summary (186 lines):
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ==[REDACTED]
// 1. COMPONENT SKELETON CHỚP TẮT
// ==[REDACTED]
const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
  const opacity = 
- **[what-changed] what-changed in Lich_Su_Lam_Bai.js**: File updated (external): Screens_Duy/Lich_Su_Lam_Bai.js

Content summary (131 lines):
// Screens_Duy/Lich_Su_Lam_Bai.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function Lich_Su_Lam_Bai({ navigation }) {
    const [historyList, setHistoryList] = useState([]);
    const 
- **[what-changed] what-changed in Man_Hinh_Lam_Bai.js**: File updated (external): Screens_Duy/Man_Hinh_Lam_Bai.js

Content summary (596 lines):
// Screens_Duy/Man_Hinh_Lam_Bai.js
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Animated, Dimensions, Image, Alert, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IMPORT FIREBASE VÀ CONTEXT ---
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, 
- **[problem-fix] Fixed null crash in TextInput — avoids unnecessary re-renders in React**: -   TextInput, SafeAreaView, Animated, Modal, ScrollView, Platform
+   TextInput, SafeAreaView, Animated, Modal, ScrollView, RefreshControl
- import { collection, query, onSnapshot, where } from 'firebase/firestore';
+ import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
- // ─────────────────────────────────────────────
+ // ==[REDACTED]
- // CONSTANTS
+ // 1. COMPONENT SKELETON (HIỆU ỨNG CHỜ TẢI)
- // ─────────────────────────────────────────────
+ // ==[REDACTED]
- const DURATION_OPTIONS = [
+ const SkeletonItem = ({ width, height, borderRadius = 4, style }) => {
-   { label: 'Tất cả', value: null },
+   const opacity = useRef(new Animated.Value(0.4)).current;
-   { label: '< 15 phút', value: [0, 14] },
+   useEffect(() => {
-   { label: '15 – 30 phút', value: [15, 30] },
+     Animated.loop(
-   { label: '> 30 phút', value: [31, 9999] },
+       Animated.sequence([
- ];
+         Animated.timing(opacity, { toValue: 0.8, duration: 500, useNativeDriver: true }),
- const QUESTIONS_OPTIONS = [
+         Animated.timing(opacity, { toValue: 0.4, duration: 500, useNativeDriver: true }),
-   { label: 'Tất cả', value: null },
+       ])
-   { label: '< 10 câu', value: [0, 9] },
+     ).start();
-   { label: '10 – 20 câu', value: [10, 20] },
+   }, [opacity]);
-   { label: '> 20 câu', value: [21, 9999] },
+   return <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#cbd5e1', opacity }, style]} />;
- ];
+ };
- const SORT_OPTIONS = [
+ 
-   { label: 'Mới nhất', value: 'newest' },
+ const renderSkeletonExamCard = (key) => (
-   { label: 'Cũ nhất', value: 'oldest' },
+   <View key={key} style={styles.examCard}>
-   { label: 'Nhiều câu nhất', value: 'most_q' },
+     <SkeletonItem width="70%" height={20} style={{ marginBottom: 10 }} />
-   { label: 'Ít câu nhất', value: 'least_q' },
+     <SkeletonItem width="40%" height={1
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [SkeletonItem, renderSkeletonExamCard, Dashboard_Thi_Sinh, styles]
- **[decision] decision in Dashboard_Thi_Sinh.js**: -         ...doc.data() //phanh thây và liệt kê các cột dữ liệu để dễ dàng
+         ...doc.data() //phanh thây và liệt kê các cột dữ liệu để dễ dàng kiểm soát kiểu dữ liệu (ví dụ: đảm bảo duration và totalQuestions là số)

📌 IDE AST Context: Modified symbols likely include [DURATION_OPTIONS, QUESTIONS_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS, SkeletonItem]
- **[decision] decision in Dashboard_Thi_Sinh.js**: -         ...doc.data() 
+         ...doc.data() //phanh thây và 

📌 IDE AST Context: Modified symbols likely include [DURATION_OPTIONS, QUESTIONS_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS, SkeletonItem]
