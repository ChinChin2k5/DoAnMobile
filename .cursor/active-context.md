> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `Screens_Duy\Dashboard_Thi_Sinh.js` (Domain: **Frontend (React/UI)**)

### 📐 Frontend (React/UI) Conventions & Fixes
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (392 changes, 6min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
392 content changes over 6 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (705 changes, 9min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
705 content changes over 9 minutes.
- **[convention] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (61 changes, 5min) — confirmed 3x**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
61 content changes over 5 minutes.
- **[convention] what-changed in Dashboard_Thi_Sinh.js — confirmed 14x**: -         <TouchableOpacity style={styles.btn_tao_de_thi} onPress={()=>navigation.navigate<<
+         <TouchableOpacity style={styles.btn_tao_de_thi} onPress={()=>navigation.navigate

📌 IDE AST Context: Modified symbols likely include [SkeletonItem, renderSkeletonExamCard, mockStats, mockExams, Dashboard_Thi_Sinh]
- **[what-changed] Refactored TouchableOpacity logic**: -           ('Tao_De_Thi_Part1')}>Tạo bài thi cá nhân</TouchableOpacity>
+           
-       </Text>
+           ('Tao_De_Thi_Part1')}>Tạo bài thi cá nhân</TouchableOpacity>
-       <View style={styles.searchContainer}>
+       </Text>
-         <Ionicons name="search" size={20} color="gray" />
+       <View style={styles.searchContainer}>
-         <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài thi..." />
+         <Ionicons name="search" size={20} color="gray" />
-         <TouchableOpacity style={styles.filterBtn}>
+         <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài thi..." />
-           <Ionicons name="options-outline" size={20} color="gray" />
+         <TouchableOpacity style={styles.filterBtn}>
-           <Text style={{ marginLeft: 5 }}>Bộ lọc</Text>
+           <Ionicons name="options-outline" size={20} color="gray" />
-         </TouchableOpacity>
+           <Text style={{ marginLeft: 5 }}>Bộ lọc</Text>
-       </View>
+         </TouchableOpacity>
- 
+       </View>
-       <View style={styles.tabContainer}>
+ 
-         <Text style={[styles.tabText, styles.activeTab]}>Tất cả ({mockExams.length})</Text>
+       <View style={styles.tabContainer}>
-         <Text style={styles.tabText}>Có thể làm (4)</Text>
+         <Text style={[styles.tabText, styles.activeTab]}>Tất cả ({mockExams.length})</Text>
-       </View>
+         <Text style={styles.tabText}>Có thể làm (4)</Text>
-     </View>
+       </View>
-   );
+     </View>
- 
+   );
-   const renderExamItem = ({ item }) => {
+ 
-     // KHI ĐANG TẢI TRANG -> TRẢ VỀ SKELETON CARD (giữ nguyên độ mượt cuộn)
+   const renderExamItem = ({ item }) => {
-     if (isPageLoading) return renderSkeletonExamCard(`skel-${item.id}`);
+     // KHI ĐANG TẢI TRANG -> TRẢ VỀ SKELETON CARD (giữ nguyên độ mượt cuộn)
- 
+     if (isPageLoading) return renderSkeletonExamCard(`skel-${item.id}`);
-     const isCanDo = item.status === 'CO_THE_LA
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [SkeletonItem, renderSkeletonExamCard, mockStats, mockExams, Dashboard_Thi_Sinh]
- **[what-changed] Refactored TouchableOpacity logic**: -         <TouchableOpacity style={styles.btn_tao_de_thi} onPress={()=>navigation.navigate<<('Tao_De_Thi_Part1')}>Tạo bài thi cá nhân</TouchableOpacity>
+         <TouchableOpacity style={styles.btn_tao_de_thi} onPress={()=>navigation.navigate<<
-       </Text>
+           ('Tao_De_Thi_Part1')}>Tạo bài thi cá nhân</TouchableOpacity>
-       <View style={styles.searchContainer}>
+       </Text>
-         <Ionicons name="search" size={20} color="gray" />
+       <View style={styles.searchContainer}>
-         <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài thi..." />
+         <Ionicons name="search" size={20} color="gray" />
-         <TouchableOpacity style={styles.filterBtn}>
+         <TextInput style={styles.searchInput} placeholder="Tìm kiếm bài thi..." />
-           <Ionicons name="options-outline" size={20} color="gray" />
+         <TouchableOpacity style={styles.filterBtn}>
-           <Text style={{ marginLeft: 5 }}>Bộ lọc</Text>
+           <Ionicons name="options-outline" size={20} color="gray" />
-         </TouchableOpacity>
+           <Text style={{ marginLeft: 5 }}>Bộ lọc</Text>
-       </View>
+         </TouchableOpacity>
- 
+       </View>
-       <View style={styles.tabContainer}>
+ 
-         <Text style={[styles.tabText, styles.activeTab]}>Tất cả ({mockExams.length})</Text>
+       <View style={styles.tabContainer}>
-         <Text style={styles.tabText}>Có thể làm (4)</Text>
+         <Text style={[styles.tabText, styles.activeTab]}>Tất cả ({mockExams.length})</Text>
-       </View>
+         <Text style={styles.tabText}>Có thể làm (4)</Text>
-     </View>
+       </View>
-   );
+     </View>
- 
+   );
-   const renderExamItem = ({ item }) => {
+ 
-     // KHI ĐANG TẢI TRANG -> TRẢ VỀ SKELETON CARD (giữ nguyên độ mượt cuộn)
+   const renderExamItem = ({ item }) => {
-     if (isPageLoading) return renderSkeletonExamCard(`skel-${item.id}`);
+     // KHI ĐANG TẢI TRANG -> TRẢ VỀ SKELETON 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [SkeletonItem, renderSkeletonExamCard, mockStats, mockExams, Dashboard_Thi_Sinh]
- **[what-changed] 🟢 Edited Screens_Duy/Lich_Su_Lam_Bai.js (150 changes, 4min)**: Active editing session on Screens_Duy/Lich_Su_Lam_Bai.js.
150 content changes over 4 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Lich_Su_Lam_Bai.js (102 changes, 3min)**: Active editing session on Screens_Duy/Lich_Su_Lam_Bai.js.
102 content changes over 3 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Chi_Tiet_Dap_An.js (975 changes, 18min)**: Active editing session on Screens_Duy/Chi_Tiet_Dap_An.js.
975 content changes over 18 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Chi_Tiet_Dap_An.js (116 changes, 2min)**: Active editing session on Screens_Duy/Chi_Tiet_Dap_An.js.
116 content changes over 2 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (13 changes, 4min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
13 content changes over 4 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (162 changes, 1min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
162 content changes over 1 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Ket_Qua_Va_Phan_Tich.js (91 changes, 6min)**: Active editing session on Screens_Duy/Ket_Qua_Va_Phan_Tich.js.
91 content changes over 6 minutes.
- **[convention] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (6 changes, 10min) — confirmed 3x**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
6 content changes over 10 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Tao_De_Thi_Part2.js (13 changes, 1min)**: Active editing session on Screens_Duy/Tao_De_Thi_Part2.js.
13 content changes over 1 minutes.
