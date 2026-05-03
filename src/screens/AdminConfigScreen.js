import * as React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"; 
import { List, Switch, Text } from "react-native-paper";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebaseConfig"; // Đảm bảo đường dẫn này đúng nhé
import AppTextInput from "../components/AppTextInput";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import Dropdown from "../components/Dropdown";
import { useTranslation } from 'react-i18next';

// ==========================================
// FORM CHUNG
// ==========================================
const ChungForm = ({ config, updateConfig }) => {
  const languageData = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "Tiếng Anh", value: "en" },
  ];
  const timezoneData = [
    { label: "Asia/Hồ Chí Minh (GMT+7)", value: "asia_hcm" },
    { label: "US/New York (GMT-5)", value: "us_ny" },
  ];

  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Tên Hệ Thống" value={config.systemName} onChangeText={(text) => updateConfig('systemName', text)} />
      <AppTextInput label="URL Hệ Thống" value={config.systemUrl} onChangeText={(text) => updateConfig('systemUrl', text)} />

      <Dropdown
        label="Ngôn ngữ mặc định"
        data={languageData}
        value={config.lang}
        onChange={(item) => updateConfig('lang', item.value)}
      />

      <Dropdown
        label="Múi giờ"
        data={timezoneData}
        value={config.timezone}
        onChange={(item) => updateConfig('timezone', item.value)}
      />

      <View style={styles.notificationBlock}>
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo Email</Text>
            <Text style={styles.notifyDesc}>Gửi thông báo qua Email</Text>
          </View>
          <Switch value={config.isEnableEmail} onValueChange={(val) => updateConfig('isEnableEmail', val)} color="#084CCB" />
        </View>
        <View style={styles.divider} />
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo SMS</Text>
            <Text style={styles.notifyDesc}>Gửi thông báo qua SMS</Text>
          </View>
          <Switch value={config.isEnableSMS} onValueChange={(val) => updateConfig('isEnableSMS', val)} color="#084CCB" />
        </View>
        <View style={styles.divider} />
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo Push</Text>
            <Text style={styles.notifyDesc}>Gửi thông báo đẩy lên điện thoại</Text>
          </View>
          <Switch value={config.isEnablePush} onValueChange={(val) => updateConfig('isEnablePush', val)} color="#084CCB" />
        </View>
      </View>
    </View>
  );
};

// ==========================================
// FORM DATABASE
// ==========================================
const DatabaseForm = ({ config, updateConfig }) => {
  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Database Host" value={config.dbHost} onChangeText={(text) => updateConfig('dbHost', text)} />
      <AppTextInput label="Database Name" value={config.dbName} onChangeText={(text) => updateConfig('dbName', text)} />
      <AppTextInput label="Port" value={config.dbPort} keyboardType="numeric" onChangeText={(text) => updateConfig('dbPort', text)} />
      <AppTextInput label="Database User" value={config.dbUser} onChangeText={(text) => updateConfig('dbUser', text)} />
    </View>
  );
};

// ==========================================
// FORM EMAIL
// ==========================================
const EmailForm = ({ config, updateConfig }) => {
  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Email Provider" value={config.emailProvider} onChangeText={(text) => updateConfig('emailProvider', text)}/>
      <AppTextInput label="SMTP Host" value={config.emailHost} onChangeText={(text) => updateConfig('emailHost', text)} />
      <AppTextInput label="SMTP Port" value={config.emailPort} keyboardType="numeric" onChangeText={(text) => updateConfig('emailPort', text)} />
      <AppTextInput label="SMTP User" value={config.emailUser} onChangeText={(text) => updateConfig('emailUser', text)} />
      <AppTextInput
        label="SMTP Password"
        value={config.emailPassword}
        secureTextEntry={true} 
        onChangeText={(text) => updateConfig('emailPassword', text)}
      />
    </View>
  );
};

// ==========================================
// FORM BẢO MẬT
// ==========================================
const SecurityForm = ({ config, updateConfig }) => {
  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Thời gian timeout (phút)" value={config.secTimeout} keyboardType="numeric" onChangeText={(text) => updateConfig('secTimeout', text)} />
      <AppTextInput label="Độ dài mật khẩu tối thiểu" value={config.secMinPasswordLength} keyboardType="numeric" onChangeText={(text) => updateConfig('secMinPasswordLength', text)} />
      <AppTextInput label="Số lần đăng nhập sai tối đa" value={config.secMaxFailedLogins} keyboardType="numeric" onChangeText={(text) => updateConfig('secMaxFailedLogins', text)} />

      <View style={styles.notificationBlock}>
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Đổi mật khẩu định kỳ</Text>
            <Text style={styles.notifyDesc}>Bắt buộc đổi mật khẩu sau 90 ngày</Text>
          </View>
          <Switch value={config.secRequirePasswordChange} onValueChange={(val) => updateConfig('secRequirePasswordChange', val)} color="#084CCB" />
        </View>
        <View style={styles.divider} />
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Chặn truy cập lạ</Text>
            <Text style={styles.notifyDesc}>Chặn truy cập từ các dải IP không xác định</Text>
          </View>
          <Switch value={config.secBlockUnknownIP} onValueChange={(val) => updateConfig('secBlockUnknownIP', val)} color="#084CCB" />
        </View>
        <View style={styles.divider} />
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>System Logs</Text>
            <Text style={styles.notifyDesc}>Ghi log tất cả các hoạt động trên hệ thống</Text>
          </View>
          <Switch value={config.secLogActivities} onValueChange={(val) => updateConfig('secLogActivities', val)} color="#084CCB" />
        </View>
      </View>
    </View>
  );
};

// ==========================================
// MÀN HÌNH CHÍNH (THẰNG CHA QUẢN LÝ TẤT CẢ)
// ==========================================
const AdminConfigScreen = () => {
  const { i18n } = useTranslation();
  const [isPushing, setIsPushing] = React.useState(false); // Cờ trạng thái loading khi đẩy data
  
  // 1. TẠO RA MỘT CỤC STATE KHỔNG LỒ CHỨA MỌI DỮ LIỆU
  const [config, setConfig] = React.useState({
    // Chung
    systemName: "EduTest Pro",
    systemUrl: "https://edutest.pro",
    lang: i18n.language || "vi",
    timezone: "asia_hcm",
    isEnableEmail: false,
    isEnableSMS: false,
    isEnablePush: false,
    // Database
    dbHost: "localhost",
    dbName: "edutest_db",
    dbPort: "5432",
    dbUser: "admin",
    // Email
    emailProvider: "SMTP",
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUser: "noreply@edutest.pro",
    emailPassword: "********",
    // Security
    secTimeout: "30",
    secMinPasswordLength: "8",
    secMaxFailedLogins: "5",
    secRequirePasswordChange: false,
    secBlockUnknownIP: true,
    secLogActivities: true,
  });

  // 2. HÀM CẬP NHẬT ĐA NĂNG (Truyền hàm này xuống cho các Form con xài)
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // 3. HÀM PHÓNG TÀU VŨ TRỤ LÊN FIREBASE
  const handleApplyConfiguration = async () => {
    try {
      setIsPushing(true); // Đang đẩy data thì báo loading...
      console.log("Bắt đầu đẩy cấu hình lên mây...");
      
      // Khai báo địa chỉ thư mục trên Firebase
      const configRef = doc(db, "SystemSettings", "AppConfigs");
      
      // Thêm cái nhãn thời gian để biết ai sửa cuối cùng
      const finalDataToPush = {
        ...config,
        lastUpdated: new Date().toISOString()
      };

      // Đẩy nguyên cục JSON béo ngậy lên Firestore! (merge: true để ko bị ghi đè mất field khác)
      await setDoc(configRef, finalDataToPush, { merge: true });

      i18n.changeLanguage(config.lang); // Áp dụng ngôn ngữ cho App ngay lập tức
      Alert.alert("Thành Công", "Đã lưu toàn bộ cấu hình hệ thống lên Firebase Server!");
      
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
      Alert.alert("Lỗi", "Gặp sự cố khi lưu cấu hình: " + error.message);
    } finally {
      setIsPushing(false); // Xong xuôi thì tắt cờ loading
    }
  };

  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView style={{ backgroundColor: "#E5EEFF" }}>
        <Header title={"Cấu hình Hệ\nThống"} leftIcon="arrow-back" showBell={true} />
        
        <View style={styles.body}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.bigHeader}>Cấu Hình Hệ Thống</Text>
            <Text>Quản Lý Các Thiết Lập Hệ Thống</Text>
          </View>
        </View>

        <List.Section style={{ paddingHorizontal: 15, backgroundColor: "transparent" }}>
          <List.AccordionGroup>
            
            {/* THẺ 1: CẤU HÌNH CHUNG */}
            <View style={styles.cardWrapper}>
              <List.Accordion title="Cấu Hình Chung" description="Core identity and localization" id="1" titleStyle={styles.accordionTitle} descriptionStyle={styles.accordionDesc} style={styles.accordionBackground} left={(props) => (<View style={styles.customIconWrapper}><List.Icon {...props} icon="cog" color="#084CCB" style={{ margin: 0 }} /></View>)}>
                <ChungForm config={config} updateConfig={updateConfig}/>
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 2: DATABASE */}
            <View style={styles.cardWrapper}>
              <List.Accordion title="Database" description="Connection parameters" id="2" titleStyle={styles.accordionTitle} descriptionStyle={styles.accordionDesc} style={styles.accordionBackground} left={(props) => (<View style={styles.customIconWrapper}><List.Icon {...props} icon="database" color="#084CCB" style={{ margin: 0 }} /></View>)}>
                <DatabaseForm config={config} updateConfig={updateConfig}/>
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 3: EMAIL */}
            <View style={styles.cardWrapper}>
              <List.Accordion title="Email" description="SMTP mail configuration" id="3" titleStyle={styles.accordionTitle} descriptionStyle={styles.accordionDesc} style={styles.accordionBackground} left={(props) => (<View style={styles.customIconWrapper}><List.Icon {...props} icon="email" color="#084CCB" style={{ margin: 0 }} /></View>)}>
                <EmailForm config={config} updateConfig={updateConfig}/>
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 4: BẢO MẬT */}
            <View style={styles.cardWrapper}>
              <List.Accordion title="Bảo Mật" description="Security rules and policies" id="4" titleStyle={styles.accordionTitle} descriptionStyle={styles.accordionDesc} style={styles.accordionBackground} left={(props) => (<View style={styles.customIconWrapper}><List.Icon {...props} icon="shield-check" color="#084CCB" style={{ margin: 0 }} /></View>)}>
                <SecurityForm config={config} updateConfig={updateConfig}/>
              </List.Accordion>
            </View>

          </List.AccordionGroup>
        </List.Section>

        <View style={styles.bottomActionRow}>
          <TouchableOpacity style={styles.btnDiscard} onPress={() => console.log("Hủy thay đổi")}>
            <Text style={styles.txtDiscard}>Discard{"\n"}Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnApply, isPushing && { opacity: 0.7 }]} onPress={handleApplyConfiguration} disabled={isPushing}>
            <Text style={styles.txtApply}>{isPushing ? "Saving..." : "Apply\nConfiguration"}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

// ==========================================
// BẢNG STYLE (GIỮ NGUYÊN HOÀN TOÀN CỦA EM)
// ==========================================
const styles = StyleSheet.create({
  body: { marginTop: 20, backgroundColor: "#E5EEFF" },
  headerTextContainer: { marginLeft: 10 },
  bigHeader: { fontFamily: "Inter-ExtraBold", fontSize: 35 },
  formContainer: { paddingTop: 10, paddingBottom: 20, backgroundColor: "white" },
  notificationBlock: { backgroundColor: "#C5EDF5", borderRadius: 16, padding: 16, marginTop: 10 },
  notifyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  notifyTextContainer: { flex: 1 },
  notifyTitle: { fontSize: 15, fontWeight: "700", color: "#1A2134", marginBottom: 4 },
  notifyDesc: { fontSize: 13, color: "#495D7A" },
  divider: { height: 1, backgroundColor: "rgba(0, 0, 0, 0.05)", marginVertical: 4 },
  accordionTitle: { fontSize: 16, fontWeight: "700", color: "#1A2134" },
  accordionDesc: { fontSize: 13, color: "#6F7F91" },
  customIconWrapper: { width: 44, height: 44, backgroundColor: "#E8EFFB", borderRadius: 12, justifyContent: "center", alignItems: "center", marginLeft: 8, marginRight: 8 },
  cardWrapper: { backgroundColor: "#FFFFFF", borderRadius: 12, marginBottom: 12, overflow: "hidden" },
  bottomActionRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 20, paddingBottom: 40, paddingHorizontal: 10 },
  btnDiscard: { paddingVertical: 12, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" },
  txtDiscard: { fontSize: 15, fontWeight: "700", color: "#495D7A", textAlign: "center" },
  btnApply: { backgroundColor: "#084CCB", paddingVertical: 14, paddingHorizontal: 36, borderRadius: 100, justifyContent: "center", alignItems: "center", shadowColor: "#084CCB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  txtApply: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", textAlign: "center" },
});

export default AdminConfigScreen;