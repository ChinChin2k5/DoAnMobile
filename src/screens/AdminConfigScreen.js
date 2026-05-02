import * as React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { List, Switch, Text } from "react-native-paper";
import axios from "axios";
import AppTextInput from "../components/AppTextInput";
import ScreenWrapper from "../components/ScreenWrapper";
import Header from "../components/Header";
import Dropdown from "../components/Dropdown";

const ChungForm = () => {
  const languageData = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "Tiếng Anh", value: "en" },
  ];
  const timezoneData = [
    { label: "Asia/Hồ Chí Minh (GMT+7)", value: "asia_hcm" },
    { label: "US/New York (GMT-5)", value: "us_ny" },
  ];

  const [lang, setLang] = React.useState("vi");
  const [tz, setTz] = React.useState("asia_hcm");
  const [isEnableEmail, setIsEmailEnabled] = React.useState(false);
  const [isEnableSMS, setIsSMSEnabled] = React.useState(false);
  const [isEnablePush, setIsPushEnabled] = React.useState(false);

  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Tên Hệ Thống" value="EduTest Pro" />
      <AppTextInput label="URL Hệ Thống" value="https://edutest.pro" />

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
        onChange={(item) => setTz(item.value)}
      />

      <View style={styles.notificationBlock}>
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo Email</Text>
            <Text style={styles.notifyDesc}>Gửi thông báo qua Email</Text>
          </View>
          <Switch
            value={isEnableEmail}
            onValueChange={setIsEmailEnabled}
            color="#084CCB"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo SMS</Text>
            <Text style={styles.notifyDesc}>Gửi thông báo qua SMS</Text>
          </View>
          <Switch
            value={isEnableSMS}
            onValueChange={setIsSMSEnabled}
            color="#084CCB"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Thông Báo Push</Text>
            <Text style={styles.notifyDesc}>
              Gửi thông báo đẩy lên điện thoại
            </Text>
          </View>
          <Switch
            value={isEnablePush}
            onValueChange={setIsPushEnabled}
            color="#084CCB"
          />
        </View>
      </View>
    </View>
  );
};

// ==========================================
// CÁC FORM CÒN LẠI GIỮ NGUYÊN TẠM THỜI
// ==========================================
const DatabaseForm = () => {
  return (
    <View style={styles.formContainer}>
      {/* Đổi hết sang AppTextInput, bỏ cái mode="outlined" đi */}
      <AppTextInput label="Database Host" value="localhost" />
      <AppTextInput label="Database Name" value="edutest_db" />
      <AppTextInput label="Port" value="5432" keyboardType="numeric" />
      <AppTextInput label="Database User" value="admin" />
    </View>
  );
};

// ==========================================
// FORM EMAIL
// ==========================================
const EmailForm = () => {
  return (
    <View style={styles.formContainer}>
      <AppTextInput label="Email Provider" value="SMTP" />
      <AppTextInput label="SMTP Host" value="smtp.gmail.com" />
      <AppTextInput label="SMTP Port" value="587" keyboardType="numeric" />
      <AppTextInput label="SMTP User" value="noreply@edutest.pro" />
      <AppTextInput
        label="SMTP Password"
        value="********"
        secureTextEntry={true} // Che mật khẩu đi cho bảo mật!
      />
    </View>
  );
};

// ==========================================
// FORM SECURITY
// ==========================================
const SecurityForm = () => {
  // Khởi tạo state cho 3 cái nút gạt bảo mật
  const [isRequirePasswordChange, setIsRequirePasswordChange] =
    React.useState(false);
  const [isBlockUnknownIP, setIsBlockUnknownIP] = React.useState(true); // Mặc định bật cho an toàn
  const [isLogActivities, setIsLogActivities] = React.useState(true);

  return (
    <View style={styles.formContainer}>
      <AppTextInput
        label="Thời gian timeout (phút)"
        value="30"
        keyboardType="numeric"
      />
      <AppTextInput
        label="Độ dài mật khẩu tối thiểu"
        value="8"
        keyboardType="numeric"
      />
      <AppTextInput
        label="Số lần đăng nhập sai tối đa"
        value="5"
        keyboardType="numeric"
      />

      {/* ======================================= */}
      {/* KHỐI BẢO MẬT NÂNG CAO - ĐỘ LẠI BẰNG NÚT GẠT */}
      {/* ======================================= */}
      <View style={styles.notificationBlock}>
        {/* Nút 1 */}
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Đổi mật khẩu định kỳ</Text>
            <Text style={styles.notifyDesc}>
              Bắt buộc đổi mật khẩu sau 90 ngày
            </Text>
          </View>
          <Switch
            value={isRequirePasswordChange}
            onValueChange={setIsRequirePasswordChange}
            color="#084CCB"
          />
        </View>

        <View style={styles.divider} />

        {/* Nút 2 */}
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>Chặn truy cập lạ</Text>
            <Text style={styles.notifyDesc}>
              Chặn truy cập từ các dải IP không xác định
            </Text>
          </View>
          <Switch
            value={isBlockUnknownIP}
            onValueChange={setIsBlockUnknownIP}
            color="#084CCB"
          />
        </View>

        <View style={styles.divider} />

        {/* Nút 3 */}
        <View style={styles.notifyRow}>
          <View style={styles.notifyTextContainer}>
            <Text style={styles.notifyTitle}>System Logs</Text>
            <Text style={styles.notifyDesc}>
              Ghi log tất cả các hoạt động trên hệ thống
            </Text>
          </View>
          <Switch
            value={isLogActivities}
            onValueChange={setIsLogActivities}
            color="#084CCB"
          />
        </View>
      </View>
    </View>
  );
};
// ==========================================
// MÀN HÌNH CHÍNH
// ==========================================
const AdminConfigScreen = () => {
  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView style={{ backgroundColor: "#E5EEFF" }}>
        <Header
          title={"Cấu hình Hệ\nThống"}
          leftIcon="arrow-back"
          showBell={true}
        />
        <View style={styles.body}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.bigHeader}>Cấu Hình Hệ Thống</Text>
              {/* Lưu ý: Nếu Text dưới đây cần style, hãy thêm vào nhé */}
              <Text>Quản Lý Các Thiết Lập Hệ Thống</Text>
            </View>
          </View>
          <List.Section
            style={{ paddingHorizontal: 15, backgroundColor: "transparent" }}
          >
            {/* Đây là cách comment đúng trong JSX */}
            {/* Thụt lề 2 bên cho khỏi cạ vào mép */}
            <List.AccordionGroup>
              <View style={styles.cardWrapper}>
                <List.Accordion
                  title="Cấu Hình Chung" // Thay chữ Chung cộc lốc bằng tiếng Anh (hoặc Cài Đặt Chung)
                  description="Core identity and localization" // Thêm Subtitle giống y xì Figma
                  id="1"
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDesc}
                  style={styles.accordionBackground}
                  // Ghi đè cái Icon mặc định bằng Khối màu xanh bọc bánh răng
                  left={(props) => (
                    <View style={styles.customIconWrapper}>
                      {/* Đổi icon thành bánh răng (cog) và set màu xanh đậm */}
                      <List.Icon
                        {...props}
                        icon="cog"
                        color="#084CCB"
                        style={{ margin: 0 }}
                      />
                    </View>
                  )}
                >
                  <ChungForm />
                </List.Accordion>
              </View>
              <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />
              <View style={styles.cardWrapper}>
                <List.Accordion
                  title="Database" // Thay chữ Chung cộc lốc bằng tiếng Anh (hoặc Cài Đặt Chung)
                  description="Core identity and localization" // Thêm Subtitle giống y xì Figma
                  id="2"
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDesc}
                  style={styles.accordionBackground}
                  // Ghi đè cái Icon mặc định bằng Khối màu xanh bọc bánh răng
                  left={(props) => (
                    <View style={styles.customIconWrapper}>
                      {/* Đổi icon thành bánh răng (cog) và set màu xanh đậm */}
                      <List.Icon
                        {...props}
                        icon="database"
                        color="#084CCB"
                        style={{ margin: 0 }}
                      />
                    </View>
                  )}
                >
                  <DatabaseForm />
                </List.Accordion>
              </View>
              <View style={styles.cardWrapper}>
                <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />
                <List.Accordion
                  title="Email" // Thay chữ Chung cộc lốc bằng tiếng Anh (hoặc Cài Đặt Chung)
                  description="Core identity and localization" // Thêm Subtitle giống y xì Figma
                  id="3"
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDesc}
                  style={styles.accordionBackground}
                  // Ghi đè cái Icon mặc định bằng Khối màu xanh bọc bánh răng
                  left={(props) => (
                    <View style={styles.customIconWrapper}>
                      {/* Đổi icon thành bánh răng (cog) và set màu xanh đậm */}
                      <List.Icon
                        {...props}
                        icon="cog"
                        color="#084CCB"
                        style={{ margin: 0 }}
                      />
                    </View>
                  )}
                >
                  <EmailForm />
                </List.Accordion>
              </View>
              <View style={{ height: 12, backgroundColor: "#E5EEFF" }} />
              <View style={styles.cardWrapper}>
                <List.Accordion
                  title="Bảo Mật" // Thay chữ Chung cộc lốc bằng tiếng Anh (hoặc Cài Đặt Chung)
                  description="Core identity and localization" // Thêm Subtitle giống y xì Figma
                  id="4"
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDesc}
                  style={styles.accordionBackground}
                  // Ghi đè cái Icon mặc định bằng Khối màu xanh bọc bánh răng
                  left={(props) => (
                    <View style={styles.customIconWrapper}>
                      {/* Đổi icon thành bánh răng (cog) và set màu xanh đậm */}
                      <List.Icon
                        {...props}
                        icon="cog"
                        color="#084CCB"
                        style={{ margin: 0 }}
                      />
                    </View>
                  )}
                >
                  <SecurityForm />
                </List.Accordion>
              </View>
            </List.AccordionGroup>
          </List.Section>
          <View style={styles.bottomActionRow}>
            {/* Nút Discard Changes (Không nền, chữ xám) */}
            <TouchableOpacity
              style={styles.btnDiscard}
              onPress={() => console.log("Hủy thay đổi")}
            >
              <Text style={styles.txtDiscard}>Discard{"\n"}Changes</Text>
            </TouchableOpacity>

            {/* Nút Apply Configuration (Nền xanh, bo tròn, có bóng đổ mờ) */}
            <TouchableOpacity
              style={styles.btnApply}
              onPress={() => console.log("Lưu cấu hình")}
            >
              <Text style={styles.txtApply}>Apply{"\n"}Configuration</Text>
            </TouchableOpacity>
          </View>
        {/* <--- Đóng thẻ styles.body */}
      </ScrollView>
    </ScreenWrapper>
  );
};

// ==========================================
// BẢNG STYLE - ĐÃ CẬP NHẬT CHUẨN DESIGN
// ==========================================
const styles = StyleSheet.create({
  body: {
    marginTop: 20,
    backgroundColor: "#E5EEFF",
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  bigHeader: {
    fontFamily: "Inter-ExtraBold",
    fontSize: 35,
  },
  formContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  // STYLE CHO KHỐI THÔNG BÁO XANH NGỌC
  notificationBlock: {
    backgroundColor: "#C5EDF5", // Màu xanh ngọc nhạt
    borderRadius: 16, // Bo góc tròn xoe
    padding: 16,
    marginTop: 10,
  },
  notifyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Căn giữa nút gạt và chữ
    paddingVertical: 8,
  },
  notifyTextContainer: {
    flex: 1, // Đẩy nút gạt sang kịch lề phải
  },
  notifyTitle: {
    fontSize: 15,
    fontWeight: "700", // Chữ tiêu đề in đậm
    color: "#1A2134",
    marginBottom: 4,
  },
  notifyDesc: {
    fontSize: 13,
    color: "#495D7A", // Chữ mô tả xám nhẹ
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Vạch kẻ ngang mờ phân cách
    marginVertical: 4,
  },
  // ... các style cũ của em giữ nguyên ...

  // STYLE DÀNH CHO ACCORDION HEADER
  accordionTitle: {
    fontSize: 16,
    fontWeight: "700", // Chữ in đậm chuẩn Figma
    color: "#1A2134", // Đen nhạt xịn xò
  },
  accordionDesc: {
    fontSize: 13,
    color: "#6F7F91", // Xám thanh lịch
  },
  customIconWrapper: {
    width: 44,
    height: 44,
    backgroundColor: "#E8EFFB", // Màu nền xanh dương nhạt (chuẩn Figma)
    borderRadius: 12, // Bo góc mượt mà
    justifyContent: "center", // Căn giữa cái icon bánh răng
    alignItems: "center",
    marginLeft: 8, // Thụt vào một xíu
    marginRight: 8, // Đẩy cái chữ ra xa một xíu
  },
  cardWrapper: {
    backgroundColor: "#FFFFFF", // Ép nền trắng cho toàn bộ thẻ
    borderRadius: 12, // Bo góc cong xịn xò
    marginBottom: 12, // Tự động đẩy các thẻ ra xa nhau (thay cho cục gạch)
    overflow: "hidden", // Thanh gươm chém đứt mọi thứ lòi ra ngoài góc bo
    // Nếu muốn App nhìn sang chảnh hơn, có thể bật dòng đổ bóng dưới đây:
    // elevation: 2,
  },
  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Căn đều 2 bên cho thoáng
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 40, // Đẩy lên một chút cho khỏi dính đáy màn hình
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
    color: "#495D7A", // Màu xám xanh giống chữ ở mô tả
    textAlign: "center", // Căn giữa 2 dòng chữ
  },
  btnApply: {
    backgroundColor: "#084CCB", // Màu xanh dương core của em
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 100, // Tuyệt chiêu bo tròn xoe thành viên thuốc!
    justifyContent: "center",
    alignItems: "center",
    // Thêm hiệu ứng bóng đổ (Shadow) xanh mờ mờ cho nó sang chảnh
    shadowColor: "#084CCB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Đổ bóng cho Android
  },
  txtApply: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF", // Chữ trắng bóc
    textAlign: "center",
  },
});

export default AdminConfigScreen;
