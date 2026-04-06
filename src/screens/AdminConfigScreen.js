import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, TextInput, Switch, Text } from 'react-native-paper';

const ChungForm = () => {
    return (
        <View>
            <TextInput label="Tên Hệ Thống" value="EduTest Pro" mode="outlined"/>
            <TextInput label="URL Hệ Thống" value="https://edutest.pro" mode="outlined"/>
        </View>
    )
}
const DatabaseForm = () => {
    return (
        <View>
            <TextInput label="Database Host" value="localhost" mode="outlined"/>
            <TextInput label="Database Name" value="edutest_db" mode="outlined"/>
            <TextInput label="Port" value="5432" mode="outlined"/>
            <TextInput label="Database User" value="admin" mode="outlined"/>
        </View>
    )
}
const EmailForm = () => {
    return (
        <View>
            <TextInput label="EmailProvider" value="SMTP" mode="outlined"/>
            <TextInput label="SMTP Host" value="smtp.gmail.com" mode="outlined"/>
            <TextInput label="SMTP Port" value="587" mode="outlined"/>
            <TextInput label="SMTP User" value="noreply@edutest.pro" mode="outlined"/>
            <TextInput label="SMTP Password" value="********" mode="outlined"/>
        </View>
    )
}
const SecurityForm = () => {
    return (
        <View>
            <TextInput label="Thời gian timeout (phút)" value="30" mode="outlined"/>
            <TextInput label="Độ dài mật khẩu tối thiểu" value="8" mode="outlined"/>
            <TextInput label="Số lần đăng nhập sai tối đa" value="5" mode="outlined"/>
        </View>
    )
}
const AdminConfigScreen = () => {
    return (
        <View>
        <View>
            <Text>Cấu Hình Hệ Thống</Text>
            <Text>Quản Lý Các Thiết Lập Hệ Thống</Text>
        </View>
        <List.Section title="Cấu Hình Hệ Thống">
            <List.AccordionGroup>
            <List.Accordion title="Chung" id="1" left={props => <List.Icon {...props} icon="tune" />}>
                <ChungForm />
            </List.Accordion>
            <List.Accordion title="Database" id="2" left={props => <List.Icon {...props} icon="database" />}>
                <DatabaseForm />
            </List.Accordion>
            <List.Accordion title="Email" id="3" left={props => <List.Icon {...props} icon="email" />}>
                <EmailForm />
            </List.Accordion>
            <List.Accordion title="Security" id="4" left={props => <List.Icon {...props} icon="security" />}>
                <SecurityForm />
            </List.Accordion>
            </List.AccordionGroup>
        </List.Section>
        </View>
    )
}

export default AdminConfigScreen;