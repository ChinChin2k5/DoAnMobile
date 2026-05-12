# Đồ án: Ứng dụng di động tạo đề thi và đánh giá năng lực Atoza

## Giới thiệu
Chúng em xây dựng đề tài này nhằm giúp các bạn học sinh/sinh viên (Thí Sinh) có thể dễ dàng tham gia thi để đánh giá năng lực của bản thân. Đồng thời, hệ thống cung cấp công cụ mạnh mẽ giúp Giảng Viên dễ dàng theo dõi Thí Sinh và tạo đề thi một cách trực quan, tự động hóa khâu chấm điểm.

## 👥 Danh Sách Thành Viên & Phân Công Nhiệm Vụ

| MSSV | Họ và Tên | Nhiệm vụ chính phụ trách |
| :--- | :--- | :--- |
| 23810310176 | **Dương Tiến Chiến** | Tạo các Screen cốt lõi: Loading, Onboarding, Admin Dashboard, Admin Config, Admin Chart |
| 23810310435 | **Nguyễn Đình Duy** | Flow Thí sinh: Đăng nhập/Đăng ký, Học sinh Dashboard, Giao diện làm bài, Lịch sử, Chi tiết đáp án. |
| 23810310313 | **Lê Công Đức** | Flow Giáo viên: Giáo viên Dashboard, Quản lý học sinh, Tạo lớp học, Tạo đề thi. |

## Công Nghệ Sử Dụng
* **Frontend:** React Native (Expo)
* **Backend/Database:** Firebase (Firestore, Authentication)
* **Libraries/Tools:** i18n (Đa ngôn ngữ), Async Storage, react-native-svg, lucide-react-native...

## Hướng Dẫn Cài Đặt 
Yêu cầu môi trường: Máy tính đã cài đặt Node.js và Git.

1. Clone repository về máy cục bộ:
   ```bash
   git clone https://github.com/ChinChin2k5/DoAnMobile
   cd https://github.com/ChinChin2k5/DoAnMobile
2. Cài đặt các gói thư viện phụ thuộc
   npm install
## Hướng Dẫn Chạy Project
1. Khởi Động Server
   npx expo start
Tài Khoản Demo 
Truy cập quyền Admin: Thưa thầy, để có thể truy cập vào các Screen của Actor Admin, tại màn hình Log In, xin vui lòng nhấn giữ vào Logo Atoza trong khoảng 3-4 giây.
Mã xác thực (Secret Key): Khi hệ thống yêu cầu, nhập mã: Atoza@AdminSuperKey2026
## Link Deploy: https://app-atoza.web.app/
