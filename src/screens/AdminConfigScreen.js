import * as React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { List, TextInput, Switch, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import Dropdown from "../components/Dropdown";

const ChungForm = () => {
  //Khai báo các giá trị để cho vào dropdown
  const languageData = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "Tiếng Anh", value: "en" },
  ];
  const timezoneData = [
    { label: "Asia/Hồ Chí Minh (GMT+7)", value: "asia_hcm" },
    { label: "US/New York (GMT-5)", value: "us_ny" },
  ];
  //Set giá trị mặc định
  const [lang, setLang] = React.useState("vi");
  const [tz, setTz] = React.useState("asia_hcm");
  //Khởi tạo useState cho việc làm nút bấm
  //false là màu trắng, true là màu xanh
  const [isEnableEmail, setIsEmailEnabled] = React.useState(false);
  const [isEnableSMS, setIsSMSEnabled] = React.useState(false);
  const [isEnablePush, setIsPushEnabled] = React.useState(false);
  return (
    <View>
      <TextInput label="Tên Hệ Thống" value="EduTest Pro" mode="outlined" />
      <TextInput
        label="URL Hệ Thống"
        value="https://edutest.pro"
        mode="outlined"
      />
      <Dropdown
        label="Ngôn ngữ mặc định"
        data={languageData}
        value={lang}
        onChange={(item) => setLang(item.value)}
      />
      <Dropdown
        label="Múi giờ"
        data={timezoneData}
        value={tz}
        onChange={(item) => setTz(item.setTz)}
      />
      <View style={styles.superbg}>
        <View style={styles.superPadding}>
          <View>
            <Text style={styles.notifycation}>Thông Báo Email</Text>
            <Text>Gửi Thông Báo Qua Email</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                isEnableEmail ? styles.buttonSelected : styles.buttonDefault,
              ]}
              onPress={() => setIsEmailEnabled(!isEnableEmail)}
            />
          </View>
        </View>
        <View style={styles.superPadding}>
          <View>
            <Text style={styles.notifycation}>Thông Báo SMS</Text>
            <Text>Gửi Thông Báo Qua SMS</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                isEnableSMS ? styles.buttonSelected : styles.buttonDefault,
              ]}
              onPress={() => setIsSMSEnabled(!isEnableSMS)}
            />
          </View>
        </View>
        <View style={styles.superPadding}>
          <View>
            <Text style={styles.notifycation}>Thông Báo Push</Text>
            <Text>Gửi Thông Báo Đẩy</Text>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.button,
                isEnablePush ? styles.buttonSelected : styles.buttonDefault,
              ]}
              onPress={() => setIsPushEnabled(!isEnablePush)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const DatabaseForm = () => {
  return (
    <View>
      <TextInput label="Database Host" value="localhost" mode="outlined" />
      <TextInput label="Database Name" value="edutest_db" mode="outlined" />
      <TextInput label="Port" value="5432" mode="outlined" />
      <TextInput label="Database User" value="admin" mode="outlined" />
    </View>
  );
};
const EmailForm = () => {
  return (
    <View>
      <TextInput label="EmailProvider" value="SMTP" mode="outlined" />
      <TextInput label="SMTP Host" value="smtp.gmail.com" mode="outlined" />
      <TextInput label="SMTP Port" value="587" mode="outlined" />
      <TextInput
        label="SMTP User"
        value="noreply@edutest.pro"
        mode="outlined"
      />
      <TextInput label="SMTP Password" value="********" mode="outlined" />
    </View>
  );
};
const SecurityForm = () => {
  const [isEnableEmail, setIsEmailEnabled] = React.useState(false);
  const [isEnableSMS, setIsSMSEnabled] = React.useState(false);
  const [isEnablePush, setIsPushEnabled] = React.useState(false);
  return (
    <View>
      <TextInput label="Thời gian timeout (phút)" value="30" mode="outlined" />
      <TextInput label="Độ dài mật khẩu tối thiểu" value="8" mode="outlined" />
      <TextInput
        label="Số lần đăng nhập sai tối đa"
        value="5"
        mode="outlined"
      />
      <View style={[styles.superbg]}>
        <View>
        <Text>Cài đặt bảo mật nâng cao</Text>
        </View>
        <View>
        <Text>Bắt buộc đổi mật khẩu sau 90 ngày</Text>
        </View>
        <View>
        <Text>Chặn truy cập từ IP lạ</Text>
        </View>
        <View>
        <Text>Ghi log tất cả các hoạt động</Text>
        </View>
      </View>
    </View>
  );
};
const AdminConfigScreen = () => {
  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView>
        <Header backgroundColor="white"></Header>
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <View style={styles.iconBackground}>
              <Feather name="settings" size={28} color="white" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.bigHeader}>Cấu Hình Hệ Thống</Text>
              <Text>Quản Lý Các Thiết Lập Hệ Thống</Text>
            </View>
          </View>
          <List.Section>
            <List.AccordionGroup>
              <List.Accordion
                title="Chung"
                id="1"
                left={(props) => <List.Icon {...props} icon="tune" />}
              >
                <ChungForm />
              </List.Accordion>
              <List.Accordion
                title="Database"
                id="2"
                left={(props) => <List.Icon {...props} icon="database" />}
              >
                <DatabaseForm />
              </List.Accordion>
              <List.Accordion
                title="Email"
                id="3"
                left={(props) => <List.Icon {...props} icon="email" />}
              >
                <EmailForm />
              </List.Accordion>
              <List.Accordion
                title="Security"
                id="4"
                left={(props) => <List.Icon {...props} icon="security" />}
              >
                <SecurityForm />
              </List.Accordion>
            </List.AccordionGroup>
          </List.Section>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  iconBackground: {
    backgroundColor: "#9333EA",
    width: 45,
    height: 45,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    padding: 10,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  bigHeader: {
    fontWeight: "bold",
    fontSize: 20,
  },
  notifycation: {
    fontWeight: "bold",
    fontSize: 18,
  },
  superPadding: {
    paddingHorizontal: 15,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  superbg: {
    backgroundColor: "#ADD8E6",
  },
  button: {
    width: 20,
    height: 20,
  },
  buttonDefault: {
    backgroundColor: "white",
  },
  buttonSelected: {
    backgroundColor: "blue",
  },
});

export default AdminConfigScreen;
