import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
export default function LoadingScreen() {
    return (
        <View style={styles.superBg}>
        <View>
            {/*Lùi ra một cấp*/}
            <Image source={require('../assets/Background.png')} alt="Logo"/>
            <Text style={styles.logoText}>ATOZA</Text>
        </View>
    </View>
    )
}
const styles = StyleSheet.create({
    superBg: {
        flex: 1,
        backgroundColor: "#3B82F6",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
    },
});