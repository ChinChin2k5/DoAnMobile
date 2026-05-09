import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const AppDropdown = ({ label, data, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.dropdownContainer} 
        itemTextStyle={styles.itemText}
        activeColor="#E8EFFB" 

        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn..." 
        value={value}
        onChange={onChange}
      />
    </View>
  );
};

export default AppDropdown;

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20 
  },
  label: {
    fontSize: 10, 
    color: '#084CCB', 
    marginBottom: 10, 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
  },
  dropdown: {
    height: 56, 
    backgroundColor: '#EEF2F9', 
    borderRadius: 16, 
    paddingHorizontal: 20, 
  },
  placeholderStyle: { 
    fontSize: 15, 
    color: '#6F7F91' 
  },
  selectedTextStyle: { 
    fontSize: 15, 
    color: '#1A2134', 
    fontWeight: '500',
  },
  iconStyle: { 
    width: 22, 
    height: 22,
    tintColor: '#5F6368', 
  },
  dropdownContainer: {
    borderRadius: 12,
    marginTop: 5,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 15,
    color: '#1A2134',
  },
});