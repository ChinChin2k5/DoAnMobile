//Kho chứa giá trị của biến trong không gian công cộng (Public use)
// context/UserContext.js
import React, { createContext, useState } from 'react';


//ý tưởng: sử dụng lệnh params của React Navigation khi chuyền dữ liệu sẽ có NHƯỢC ĐIỂM là: các Screen sẽ phải chuyền params qua lại cho nhau, dẫn đến việc code trở nên rối rắm và khó bảo trì.
//VÍ DỤ: Screen trang chủ (Home) là nơi duy nhất lưu giá trị "userName", nhưng khi muốn mở screen Profile (screen đáng ra sẽ cần có "userName" để hiển thị dữ liệu dựa trên tài khoản người dùng hiện tại ) từ Screen KHÔNG phải trang chủ (Home)- Nơi duy nhất lưu trữ "userName". Thì tính năng chuyền params sẽ bị ngắt đứt
//--> dẫn đến Screen Profile sẽ không thể truy cập được "userName" để hiển thị dữ liệu do khi navigation từ screen khác (không phải Home chứa "userName") sang screen "Profile"
// Thay vào đó, ta sẽ sử dụng API Context để tạo ra một "kho chứa" chung cho các thông tin như userName, userRole, classCode,... mà tất cả các Screen đều có thể truy cập và cập nhật trực tiếp mà không cần phải chuyền qua lại params giữa các Screen.
// 1. Tạo Context (Kho chứa)
export const UserContext = createContext();

// 2. Tạo Provider (Người quản lý kho)
export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Người dùng mới'); // Dữ liệu mặc định 
  const [userRole, setUserRole] = useState('Giáo viên'); // 'Học sinh' hoặc 'Giáo viên'
  const [classCode, setClassCode] = useState('Lop_Mobile_01');//Mã lớp mặc định

  return (
    <UserContext.Provider value={{ userName, setUserName,userRole, setUserRole, classCode, setClassCode }}>
      {children}
    </UserContext.Provider>
  );
};