import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { List, Switch, Text } from "react-native-paper";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import AppTextInput from "../components/AppTextInput";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import Dropdown from "../components/Dropdown";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// FORM CHUNG
const ChungForm = ({ config, updateConfig }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const doiSangTiengAnh = () => {
    i18n.changeLanguage("en"); //Nó sẽ đổi UI và tự lưu vào AsyncStorage
  };

  const doiSangTiengViet = () => {
    i18n.changeLanguage("vi");
  };
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
      <AppTextInput
        label={t("configScreen.gen_sysName")}
        value={config.systemName}
        onChangeText={(text) => updateConfig("systemName", text)}
      />
      <AppTextInput
        label={t("configScreen.gen_sysUrl")}
        value={config.systemUrl}
        onChangeText={(text) => updateConfig("systemUrl", text)}
      />

      <Dropdown
        label={t("configScreen.gen_defaultLang")}
        data={languageData}
        value={config.lang}
        onChange={(item) => updateConfig("lang", item.value)}
      />

      <Dropdown
        label={t("configScreen.gen_timezone")}
        data={timezoneData}
        value={config.timezone}
        onChange={(item) => updateConfig("timezone", item.value)}
      />
    </View>
  );
};

// FORM DATABASE
const DatabaseForm = ({ config, updateConfig }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.formContainer}>
      <AppTextInput
        label={t("configScreen.db_host")}
        value={config.dbHost}
        onChangeText={(text) => updateConfig("dbHost", text)}
      />
      <AppTextInput
        label={t("configScreen.db_name")}
        value={config.dbName}
        onChangeText={(text) => updateConfig("dbName", text)}
      />
      <AppTextInput
        label={t("configScreen.db_port")}
        value={config.dbPort}
        keyboardType="numeric"
        onChangeText={(text) => updateConfig("dbPort", text)}
      />
      <AppTextInput
        label={t("configScreen.db_user")}
        value={config.dbUser}
        onChangeText={(text) => updateConfig("dbUser", text)}
      />
    </View>
  );
};

// FORM EMAIL
const EmailForm = ({ config, updateConfig }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.formContainer}>
      <AppTextInput
        label={t("configScreen.email_provider")}
        value={config.emailProvider}
        onChangeText={(text) => updateConfig("emailProvider", text)}
      />
      <AppTextInput
        label={t("configScreen.email_host")}
        value={config.emailHost}
        onChangeText={(text) => updateConfig("emailHost", text)}
      />
      <AppTextInput
        label={t("configScreen.email_port")}
        value={config.emailPort}
        keyboardType="numeric"
        onChangeText={(text) => updateConfig("emailPort", text)}
      />
      <AppTextInput
        label={t("configScreen.email_user")}
        value={config.emailUser}
        onChangeText={(text) => updateConfig("emailUser", text)}
      />
      <AppTextInput
        label={t("configScreen.email_password")}
        value={config.emailPassword}
        secureTextEntry={true}
        onChangeText={(text) => updateConfig("emailPassword", text)}
      />
    </View>
  );
};

// FORM BẢO MẬT
const SecurityForm = ({ config, updateConfig }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.formContainer}>
      <AppTextInput
        label={t("configScreen.sec_timeout")}
        value={config.secTimeout}
        keyboardType="numeric"
        onChangeText={(text) => updateConfig("secTimeout", text)}
      />
      <AppTextInput
        label={t("configScreen.sec_minPassLen")}
        value={config.secMinPasswordLength}
        keyboardType="numeric"
        onChangeText={(text) => updateConfig("secMinPasswordLength", text)}
      />
      <AppTextInput
        label={t("configScreen.sec_maxFailed")}
        value={config.secMaxFailedLogins}
        keyboardType="numeric"
        onChangeText={(text) => updateConfig("secMaxFailedLogins", text)}
      />
    </View>
  );
};

// MÀN HÌNH CHÍNH
const AdminConfigScreen = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
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

  // 2. HÀM CẬP NHẬT ĐA NĂNG
  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // 3. HÀM PHÓNG LÊN FIREBASE
  const handleApplyConfiguration = async () => {
    try {
      setIsPushing(true); // Đang đẩy data thì báo loading...
      console.log("Bắt đầu đẩy cấu hình lên mây...");

      // Khai báo địa chỉ thư mục trên Firebase
      const configRef = doc(db, "SystemSettings", "AppConfigs");

      // Thêm cái nhãn thời gian để biết ai sửa cuối cùng
      const finalDataToPush = {
        ...config,
        lastUpdated: new Date().toISOString(),
      };

      // Đẩy nguyên cục JSONlên Firestore! (merge: true để ko bị ghi đè mất field khác)
      await setDoc(configRef, finalDataToPush, { merge: true });
      await i18n.changeLanguage(config.lang);
      await AsyncStorage.setItem("settings.lang", config.lang);
      console.log("Đã khóa ngôn ngữ xuống ổ cứng:", config.lang);
      i18n.changeLanguage(config.lang); // Áp dụng ngôn ngữ cho App ngay lập tức
      Alert.alert(
        "Thành Công",
        "Đã lưu toàn bộ cấu hình hệ thống lên Firebase Server!"
      );
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
      Alert.alert("Lỗi", "Gặp sự cố khi lưu cấu hình: " + error.message);
    } finally {
      setIsPushing(false); // Xong xuôi thì tắt cờ loading
    }
  };

  return (
    <ScreenWrapper backgroundColor="#E5EEFF">
      <ScrollView
        style={{ backgroundColor: "#E5EEFF" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <Header
          title={t("configScreen.headerTitle")}
          leftIcon="arrow-back"
          showBell={true}
        />
        <View style={styles.headerDivider} />

        <View style={styles.body}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.bigHeader}>{t("configScreen.pageTitle")}</Text>
            <Text>{t("configScreen.pageSubtitle")}</Text>
          </View>
        </View>

        <List.Section
          style={{ paddingHorizontal: 15, backgroundColor: "transparent" }}
        >
          <List.AccordionGroup>
            {/* THẺ 1: CẤU HÌNH CHUNG */}
            <View style={styles.cardWrapper}>
              <List.Accordion
                title={t("configScreen.accGeneralTitle")}
                description={t("configScreen.accGeneralDesc")}
                id="1"
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDesc}
                style={styles.accordionBackground}
                left={(props) => (
                  <View style={styles.customIconWrapper}>
                    <List.Icon
                      {...props}
                      icon="cog"
                      color="#084CCB"
                      style={{ margin: 0 }}
                    />
                  </View>
                )}
              >
                <ChungForm config={config} updateConfig={updateConfig} />
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 2: DATABASE */}
            <View style={styles.cardWrapper}>
              <List.Accordion
                title={t("configScreen.accDbTitle")}
                description={t("configScreen.accDbDesc")}
                id="2"
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDesc}
                style={styles.accordionBackground}
                left={(props) => (
                  <View style={styles.customIconWrapper}>
                    <List.Icon
                      {...props}
                      icon="database"
                      color="#084CCB"
                      style={{ margin: 0 }}
                    />
                  </View>
                )}
              >
                <DatabaseForm config={config} updateConfig={updateConfig} />
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 3: EMAIL */}
            <View style={styles.cardWrapper}>
              <List.Accordion
                title={t("configScreen.accEmailTitle")}
                description={t("configScreen.accEmailDesc")}
                id="3"
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDesc}
                style={styles.accordionBackground}
                left={(props) => (
                  <View style={styles.customIconWrapper}>
                    <List.Icon
                      {...props}
                      icon="email"
                      color="#084CCB"
                      style={{ margin: 0 }}
                    />
                  </View>
                )}
              >
                <EmailForm config={config} updateConfig={updateConfig} />
              </List.Accordion>
            </View>
            <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />

            {/* THẺ 4: BẢO MẬT */}
            <View style={styles.cardWrapper}>
              <List.Accordion
                title={t("configScreen.accSecTitle")}
                description={t("configScreen.accSecDesc")}
                id="4"
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDesc}
                style={styles.accordionBackground}
                left={(props) => (
                  <View style={styles.customIconWrapper}>
                    <List.Icon
                      {...props}
                      icon="shield-check"
                      color="#084CCB"
                      style={{ margin: 0 }}
                    />
                  </View>
                )}
              >
                <SecurityForm config={config} updateConfig={updateConfig} />
              </List.Accordion>
            </View>
          </List.AccordionGroup>
        </List.Section>

        <View style={styles.bottomActionRow}>
          <TouchableOpacity
            style={styles.btnDiscard}
            onPress={() => console.log("Hủy thay đổi")}
          >
            <Text style={styles.txtDiscard}>
              {t("configScreen.btnDiscard")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnApply, isPushing && { opacity: 0.7 }]}
            onPress={handleApplyConfiguration}
            disabled={isPushing}
          >
            <Text style={styles.txtApply}>
              {isPushing
                ? t("configScreen.btnSaving")
                : t("configScreen.btnApply")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  body: {
    marginTop: 0,
    paddingHorizontal: 15,
    backgroundColor: "#E5EEFF",
    marginBottom: 20,
  },
  headerTextContainer: { marginLeft: 10 },
  bigHeader: { fontFamily: "Inter-ExtraBold", fontSize: 35 },
  formContainer: {
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  notificationBlock: {
    backgroundColor: "#C5EDF5",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  notifyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  notifyTextContainer: { flex: 1 },
  notifyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2134",
    marginBottom: 4,
  },
  notifyDesc: { fontSize: 13, color: "#495D7A" },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    marginVertical: 4,
  },
  accordionTitle: { fontSize: 16, fontWeight: "700", color: "#1A2134" },
  accordionDesc: { fontSize: 13, color: "#6F7F91" },
  customIconWrapper: {
    width: 44,
    height: 44,
    backgroundColor: "#E8EFFB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
  },
  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  btnDiscard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  txtDiscard: {
    fontSize: 15,
    fontWeight: "700",
    color: "#495D7A",
    textAlign: "center",
  },
  btnApply: {
    backgroundColor: "#084CCB",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#084CCB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  txtApply: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cardWrapper: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#084CCB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  headerDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
});

export default AdminConfigScreen;
