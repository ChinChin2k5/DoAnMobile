// context/ConfigContext.js
//
// ĐÂY LÀ FILE GỐC — tạo trước tiên
// Mục đích: lưu cấu hình hệ thống đọc từ Firestore (SystemSettings/AppConfigs)
// vào một "kho chung" (Context) để mọi màn hình đều dùng được
// mà không cần gọi Firestore lại nhiều lần.
//
// Luồng hoạt động:
//   App.js đọc Firestore 1 lần → lưu vào ConfigContext
//   Login.js đọc từ ConfigContext → dùng giá trị config
//
// Cách dùng ở file khác:
//   import { ConfigContext } from '../context/ConfigContext';
//   const config = useContext(ConfigContext);
//   config.secMinPasswordLength → "8"
//   config.secMaxFailedLogins  → "5"

import React, { createContext } from 'react';

// ── Giá trị mặc định (fallback khi Firestore chưa load xong) ──
// Các giá trị này khớp chính xác với field name trong Firestore AppConfigs
const DEFAULT_CONFIG = {
    // Bảo mật đăng nhập
    secMinPasswordLength:    '6',   // độ dài tối thiểu mật khẩu
    secMaxFailedLogins:      '5',   // số lần đăng nhập sai tối đa
    secTimeout:              '30',  // phút — tự đăng xuất sau bao lâu không dùng
    secBlockUnknownIP:       false, // chặn IP lạ → hiện thông báo riêng
    secRequirePasswordChange: false,// yêu cầu đổi mật khẩu (dùng cho flow quên mk)
    secLogActivities:        true,  // ghi log hoạt động

    // Thông tin hệ thống (dùng cho UI sau này)
    systemName: 'Atoza',
    language:   'vi',
    timezone:   'asia_hcm',

    // Trạng thái loading — để Login.js biết config đã sẵn sàng chưa
    isLoaded: false,
};

// Tạo Context với giá trị mặc định
export const ConfigContext = createContext(DEFAULT_CONFIG);

// Export DEFAULT_CONFIG để App.js dùng làm base khi merge với data Firestore
export { DEFAULT_CONFIG };