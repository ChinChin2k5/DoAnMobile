> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `Screens_Duy\Man_Hinh_Lam_Bai.js` (Domain: **Frontend (React/UI)**)

### 📐 Frontend (React/UI) Conventions & Fixes
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (44 changes, 10min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
44 content changes over 10 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (13 changes, 4min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
13 content changes over 4 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (162 changes, 1min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
162 content changes over 1 minutes.
- **[convention] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (6 changes, 10min) — confirmed 3x**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
6 content changes over 10 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Man_Hinh_Lam_Bai.js (650 changes, 10min)**: Active editing session on Screens_Duy/Man_Hinh_Lam_Bai.js.
650 content changes over 10 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (348 changes, 9min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
348 content changes over 9 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Lich_Su_Lam_Bai.js (150 changes, 4min)**: Active editing session on Screens_Duy/Lich_Su_Lam_Bai.js.
150 content changes over 4 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Lich_Su_Lam_Bai.js (102 changes, 3min)**: Active editing session on Screens_Duy/Lich_Su_Lam_Bai.js.
102 content changes over 3 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Chi_Tiet_Dap_An.js (975 changes, 18min)**: Active editing session on Screens_Duy/Chi_Tiet_Dap_An.js.
975 content changes over 18 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Chi_Tiet_Dap_An.js (116 changes, 2min)**: Active editing session on Screens_Duy/Chi_Tiet_Dap_An.js.
116 content changes over 2 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Ket_Qua_Va_Phan_Tich.js (91 changes, 6min)**: Active editing session on Screens_Duy/Ket_Qua_Va_Phan_Tich.js.
91 content changes over 6 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (392 changes, 6min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
392 content changes over 6 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Tao_De_Thi_Part2.js (13 changes, 1min)**: Active editing session on Screens_Duy/Tao_De_Thi_Part2.js.
13 content changes over 1 minutes.
- **[what-changed] 🟢 Edited Screens_Duy/Dashboard_Thi_Sinh.js (705 changes, 9min)**: Active editing session on Screens_Duy/Dashboard_Thi_Sinh.js.
705 content changes over 9 minutes.
- **[convention] Fixed null crash in STATE — prevents null/undefined runtime crashes — confirmed 3x**: -     // 1. NHẬN DỮ LIỆU TỪ PART 1
+     const { examContent } = route?.params || {};
-     const { examContent } = route?.params || {};
+     const totalQuestions = examContent?.questions?.length || 1;
- 
+     const sourceType = examContent?.sourceType || 'manual';
-     const totalQuestions = examContent?.questions?.length || 1;
+     const domain = examContent?.domain || 'N/A';
-     const sourceType = examContent?.sourceType || 'manual';
+ 
-     const domain = examContent?.domain || 'N/A';
+     // --- STATE MỚI ---
- 
+     const [examTitle, setExamTitle] = useState(''); // Tên bài thi
-     // 2. STATE CẤU HÌNH
+     const [allowRetake, setAllowRetake] = useState(false); // Cho phép làm lại
-     const [volume, setVolume] = useState(totalQuestions);
+     
-     const [duration, setDuration] = useState(30); // Mặc định là 30 phút
+     // --- STATE CẤU HÌNH CŨ ---
-     const [shuffleQuestions, setShuffleQuestions] = useState(true);
+     const [volume, setVolume] = useState(totalQuestions);
-     const [shuffleAnswers, setShuffleAnswers] = useState(false);
+     const [duration, setDuration] = useState(30);
-     const [antiCheating, setAntiCheating] = useState(false);
+     const [shuffleQuestions, setShuffleQuestions] = useState(true);
- 
+     const [shuffleAnswers, setShuffleAnswers] = useState(false);
-     const handleGenerateTest = async () => {
+     const [antiCheating, setAntiCheating] = useState(false);
-         try {
+ 
-             const finalExamData = {
+     const handleGenerateTest = async () => {
-                 ...examContent,
+         if (!examTitle.trim()) {
-                 config: {
+             alert("Vui lòng nhập tên bài thi!");
-                     volume: volume,
+             return;
-                     duration: duration, // Lưu thời gian do người dùng chọn/nhập
+         }
-                     rules: { shuffleQuestions, shuffleAnswers, antiCheating }
+ 
-                 }
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [SummaryChip, Tao_De_Thi_Part2, RuleItem, styles]
