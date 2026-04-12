import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, TextInput, Switch, Text } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import ScreenWrapper from "../components/ScreenWrapper";

const ChungForm = () => {
  return (
    <View>
      <TextInput label="Tên Hệ Thống" value="EduTest Pro" mode="outlined" />
      <TextInput
        label="URL Hệ Thống"
        value="https://edutest.pro"
        mode="outlined"
      />
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
  return (
    <View>
      <TextInput label="Thời gian timeout (phút)" value="30" mode="outlined" />
      <TextInput label="Độ dài mật khẩu tối thiểu" value="8" mode="outlined" />
      <TextInput
        label="Số lần đăng nhập sai tối đa"
        value="5"
        mode="outlined"
      />
    </View>
  );
};
const AdminConfigScreen = () => {
  return (
    <ScreenWrapper backgroundColor="ffffff">
      <ScrollView>
        <View>
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
});

export default AdminConfigScreen;
