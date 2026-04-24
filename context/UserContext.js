//Kho chứa giá trị của biến trong không gian công cộng (Public use)
// context/UserContext.js
import React, { createContext, useState } from 'react';

// 1. Tạo Context (Kho chứa)
export const UserContext = createContext();

// 2. Tạo Provider (Người quản lý kho)
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Người dùng mới'); // Dữ liệu mặc định 
  const [userRole, setUserRole] = useState('giảng viên'); // 'thí sinh' hoặc 'giảng viên'
  const [classCode, setClassCode] = useState('Lop_Mobile_01');

  return (
    <UserContext.Provider value={{ userName, setUserName,userRole, setUserRole, classCode, setClassCode }}>
      {children}
    </UserContext.Provider>
  );
};