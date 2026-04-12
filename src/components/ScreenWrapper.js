import React from 'react';
import { StyleSheet  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenWrapper({children, backgroundColor = 'f8f9fa'}) {
    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            {/*children là một prop đặc biệt, cho phép tái sử dụng code nhiều lần*/}
            {children}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    }
})