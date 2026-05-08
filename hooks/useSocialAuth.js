// hooks/useSocialAuth.js

// useState: để tạo state local cho hook (loading, error)
import { useState } from 'react';
// Platform: giúp biết đang chạy trên 'ios' | 'android' | 'web'
import { Platform } from 'react-native';

// WebBrowser: cần cho luồng đăng nhập OAuth trên Expo (đặc biệt là Web)
import * as WebBrowser from 'expo-web-browser';

// Các hook tiện ích để làm Google / Facebook login trong Expo
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';

// Các hàm & provider của Firebase Auth dùng cho đăng nhập mạng xã hội
import {
    GoogleAuthProvider,    // Tạo credential cho Google
    FacebookAuthProvider,  // Tạo credential cho Facebook
    signInWithCredential,  // Đăng nhập Firebase bằng credential có sẵn (token)
    signInWithPopup,       // Dùng cho Web: hiện popup đăng nhập (Google / Facebook)
    signOut                // Thêm signOut để huỷ phiên khi sai Role (xung đột vai trò)
} from 'firebase/auth';

// Firestore: thao tác với collection 'users'
// Bổ sung query, collection, where, getDocs để tìm user theo email (tránh trùng email)
import {
    doc, getDoc, setDoc, updateDoc, serverTimestamp,
    query, collection, where, getDocs
} from 'firebase/firestore';

// auth, db đã cấu hình sẵn trong firebaseConfig.js
import { auth, db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Bắt buộc gọi để hoàn tất phiên auth trên Web (Expo yêu cầu)
// Nếu không có dòng này, một số luồng OAuth có thể không đóng đúng cách.
WebBrowser.maybeCompleteAuthSession();

// App ID của Facebook (tạo trong Meta Developers)
const FACEBOOK_APP_ID = '2078204966089322';

// Client ID Web của Google (tạo trong Google Cloud Console)
// Dùng chung cho webClientId / prompt OAuth
const GOOGLE_WEB_CLIENT = '832551425671-spk2j9c26cnv5gf8lf4tb1t4hms2nu7k.apps.googleusercontent.com';

/**
 * getOrCreateUser
 * ----------------
 * Trách nhiệm:
 *  - Nhận thông tin user từ Firebase Auth (uid, displayName, email) + role đang chọn trên Tab (selectedRole).
 *  - Kiểm tra xem email này đã tồn tại trong collection 'users' chưa.
 *    + Nếu có: đọc role trong DB, chuẩn hoá về "Học sinh"/"Giáo viên"/"Admin".
 *      - Nếu role trong DB KHÁC với role mà user đang chọn Tab → báo lỗi (xung đột vai trò).
 *      - Nếu trùng role → trả về thông tin user (đăng nhập bình thường).
 *    + Nếu chưa có: tạo document mới với role đúng như Tab hiện tại (selectedRole).
 */
async function getOrCreateUser(uid, displayName, email, selectedRole) {
    // Chuyển email về dạng chữ thường để tránh trùng "A@gmail.com" vs "a@gmail.com"
    const emailLower = (email || '').toLowerCase();

    // 1. Kiểm tra xem đã có User nào trong Firestore dùng Email này chưa (bất kể UID)
    //    → Mục tiêu: một email chỉ thuộc về 1 tài khoản / một role nhất định.
    let existingUser = null;

    if (emailLower) {
        // Tạo query: tìm trong collection 'users' document nào có field email == emailLower
        const q = query(collection(db, 'users'), where('email', '==', emailLower));
        const querySnapshot = await getDocs(q);

        // Nếu có ít nhất 1 document trùng email → lấy document đầu tiên (theo design hiện tại)
        if (!querySnapshot.empty) {
            existingUser = querySnapshot.docs[0].data();
        }
    }

    // 2. Nếu tìm thấy User bằng Email hoặc UID (ở đây theo email)
    if (existingUser) {
        // Chuẩn hóa role từ DB để so sánh với role Tab đang chọn
        // Mặc định nếu không có role thì coi là "Học sinh"
        let roleInDb = existingUser.role || 'Học sinh';

        // Nếu DB đang lưu dạng tiếng Anh → map lại sang tiếng Việt
        if (roleInDb === 'student') roleInDb = 'Học sinh';
        if (roleInDb === 'teacher') roleInDb = 'Giáo viên';

        // KIỂM TRA XUNG ĐỘT ROLE:
        //  - Nếu role trong DB khác với role đang chọn trên Tab 로그인 (activeRole)
        //  - Ngoại lệ: nếu role trong DB là Admin/admin thì cho phép login từ mọi Tab
        if (roleInDb !== 'Admin' && roleInDb !== 'admin' && roleInDb !== selectedRole) {
            // Thay vì return, ta ném lỗi để hàm processSignIn() bắt và hiển thị ra UI
            // Nội dung message được dùng luôn cho setSocialError
            throw new Error(
                `Email này đã được đăng ký với vai trò "${roleInDb}". Vui lòng chọn đúng Tab để đăng nhập.`
            );
        }

        // Nếu role trùng khớp (hoặc là Admin) thì coi như hợp lệ.
        // Dù UID có khác (vd: trước đăng nhập bằng email/password, giờ đăng nhập bằng Google),
        // ta vẫn ưu tiên dữ liệu trong Firestore (fullName, email, role) để đồng bộ.
        return {
            role: roleInDb,
            fullName: existingUser.fullName || displayName || 'Người dùng',
            email: existingUser.email || emailLower,
        };
    }

    // 3. Nếu chưa có User nào dùng Email này -> Tạo tài khoản mới với role đã chọn trên Tab
    const newUser = {
        uid,                             // UID từ Firebase Auth
        fullName: displayName || 'Người dùng', // Tên hiển thị (nếu Google/Facebook không trả thì dùng mặc định)
        email: emailLower,               // Email chuẩn hoá chữ thường
        role: selectedRole,              // Lưu đúng role theo Tab hiện tại ("Học sinh"/"Giáo viên"/"Admin")
        createdAt: serverTimestamp(),    // Thời điểm tạo (server time của Firestore)
    };

    // Ghi document mới vào collection 'users' với id = uid
    await setDoc(doc(db, 'users', uid), newUser);

    // Trả về thông tin user mới tạo để set vào UserContext
    return { role: newUser.role, fullName: newUser.fullName, email: newUser.email };
}

/**
 * useSocialAuth
 * -------------
 * Hook custom dùng lại cho màn Login:
 *  - Xử lý đăng nhập bằng Google, Facebook.
 *  - Kiểm tra & lưu thông tin user vào Firestore thông qua getOrCreateUser().
 *  - Kiểm tra xung đột role (theo Tab activeRole).
 *  - Điều hướng (navigate) theo vai trò (MainTabs hoặc MainTabsAdmin).
 */
export function useSocialAuth({ setUserName, setUserRole, navigation, activeRole }) {
    // socialLoading: 'google' | 'facebook' | null → để hiển thị spinner trên nút tương ứng
    const [socialLoading, setSocialLoading] = useState(null);
    // socialError: lưu message lỗi để show lên UI (banner đỏ trên màn Login)
    const [socialError, setSocialError] = useState('');

    // Google.useAuthRequest:
    //  - Tạo config & trả về hàm gPromptAsync dùng cho Android/iOS.
    //  - gResponse hiện không dùng trực tiếp (nên để dấu , phía trước).
    //const [, gResponse, gPromptAsync] = Google.useAuthRequest({
        //webClientId: GOOGLE_WEB_CLIENT, // Client ID Web đã khai báo ở trên
        //prompt: 'select_account',       // Ép Google popup cho phép chọn lại tài khoản
    //});

    // Facebook.useAuthRequest:
    //  - Tương tự Google nhưng dành cho Facebook
    const [, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
    });

    /**
     * navigateByRole
     * --------------
     * Điều hướng sau khi đăng nhập thành công:
     *  - Giáo viên hoặc Admin → MainTabsAdmin
     *  - Học sinh (hoặc role khác) → MainTabs
     */
    const navigateByRole = (role) => {
        if (role === 'Giáo viên' || role === 'admin' || role === 'Admin') {
            navigation.navigate('MainTabsAdmin');
        } else {
            navigation.navigate('MainTabs');
        }
    };

    /**
     * processSignIn
     * -------------
     * Nhận user đã được Firebase Auth xác thực (Google/Facebook).
     * Sau đó:
     *  1. Gọi getOrCreateUser để:
     *      - Lấy hoặc tạo document tương ứng trong Firestore.
     *      - Kiểm tra xem role có trùng với Tab hiện tại không (activeRole).
     *  2. Nếu ok:
     *      - setUserName, setUserRole vào UserContext.
     *      - navigateByRole theo role.
     *  3. Nếu lỗi (thường là xung đột role):
     *      - Lưu message lỗi vào socialError cho UI hiển thị.
     *      - QUAN TRỌNG: signOut(auth) để xoá session của Firebase
     *        (vì lúc này Firebase Auth đã đăng nhập xong, nhưng ta không cho vào app).
     */
    const processSignIn = async (user) => {
        try {
            const { role, fullName } = await getOrCreateUser(
                user.uid,
                user.displayName,
                user.email,
                activeRole         // role đang chọn ở Tab Login ("Học sinh"/"Giáo viên")
            );

            // Lưu tên & role vào context toàn app
            setUserName(fullName);
            setUserRole(role);

            // Điều hướng theo vai trò
            navigateByRole(role);
        } catch (error) {
            // Nếu getOrCreateUser ném lỗi (ví dụ xung đột role)
            // → Hiển thị message lên giao diện
            setSocialError(error.message);

            // QUAN TRỌNG:
            //   Tại thời điểm này Firebase Auth đã có user (session hợp lệ),
            //   nhưng vì lý do role không khớp nên ta không cho user sử dụng app.
            //   Cần signOut ngay để tránh việc app nghĩ là vẫn đang đăng nhập.
            await signOut(auth);
        }
    };

    /**
     * handleGoogle
     * ------------
     * Hàm xử lý khi người dùng bấm nút "Đăng nhập bằng Google".
     *  - Web: dùng signInWithPopup.
     *  - Mobile (Android/iOS): dùng gPromptAsync + signInWithCredential.
     *  - Sau khi có user từ Firebase Auth → gọi processSignIn(user).
     */
    const handleGoogle = async () => {
        // Reset lỗi cũ trước khi bắt đầu login mới
        setSocialError('');
        // Đánh dấu trạng thái loading của Google (để disable nút, show spinner)
        setSocialLoading('google');

        try {
            // Lưu role đang chọn vào bộ nhớ tạm trước khi mở Google
            await AsyncStorage.setItem('pending_login_role', activeRole);

            if (Platform.OS === 'web') {
                // Trường hợp chạy trên web: dùng signInWithPopup
                const provider = new GoogleAuthProvider();
                // Tham số prompt 'select_account' giúp Google luôn hiện popup chọn tài khoản
                provider.setCustomParameters({ prompt: 'select_account' });

                // Mở popup Google, sau khi user chọn xong → result.user
                const result = await signInWithPopup(auth, provider);

                // Tiếp tục xử lý trong processSignIn (check role, lưu Firestore, navigate)
                await processSignIn(result.user);
            } else {
                // Trên mobile (Android/iOS): dùng AuthSession
                const result = await gPromptAsync();

                // Nếu user cancel (đóng popup, bấm back) → type khác 'success'
                if (result?.type !== 'success') return;

                // Lấy id_token từ Google để tạo credential cho Firebase
                const credential = GoogleAuthProvider.credential(result.params.id_token);

                // Đăng nhập Firebase bằng credential
                const { user } = await signInWithCredential(auth, credential);

                // Xử lý chung: check role, Firestore, navigate
                await processSignIn(user);
            }
        } catch (err) {
            // Nếu có lỗi trong quá trình gọi Google / Firebase
            // (không phải lỗi xung đột role của getOrCreateUser)
            console.error('Lỗi thật sự của Google:', err); // Thêm dòng này để debug dễ hơn
            setSocialError('Đăng nhập Google thất bại');
        } finally {
            // Dù thành công hay thất bại cũng tắt trạng thái loading
            setSocialLoading(null);
        }
    };

    /**
     * handleFacebook
     * --------------
     * Tương tự handleGoogle nhưng dùng provider Facebook.
     *  - Web: signInWithPopup.
     *  - Mobile: fbPromptAsync + signInWithCredential.
     */
    const handleFacebook = async () => {
        // Xoá lỗi cũ
        setSocialError('');
        // Đánh dấu đang login Facebook
        setSocialLoading('facebook');

        try {
            // Lưu role vào bộ nhớ
            await AsyncStorage.setItem('pending_login_role', activeRole);

            if (Platform.OS === 'web') {
                // Web: dùng popup để đăng nhập Facebook
                const provider = new FacebookAuthProvider();
                const result = await signInWithPopup(auth, provider);

                // Tiếp tục xử lý chung
                await processSignIn(result.user);
            } else {
                // Mobile: dùng fbPromptAsync (AuthSession)
                const result = await fbPromptAsync();

                // Nếu user cancel → không làm gì thêm
                if (result?.type !== 'success') return;

                // Lấy access_token từ Facebook để tạo credential cho Firebase
                const credential = FacebookAuthProvider.credential(result.params.access_token);

                // Đăng nhập Firebase Auth bằng credential
                const { user } = await signInWithCredential(auth, credential);

                // Xử lý chung
                await processSignIn(user);
            }
        } catch (err) {
            // Lỗi trong luồng Facebook (không phải lỗi role)
            console.error('Lỗi thật sự của Facebook:', err); // Thêm dòng này để dubug dễ hơn
            setSocialError(`Lỗi đăng nhập Facebook`);
        } finally {
            // Tắt trạng thái loading Facebook
            setSocialLoading(null);
        }
    };

    // Trả ra cho component sử dụng hook:
    //  - handleGoogle, handleFacebook: gọi khi bấm nút social login
    //  - socialLoading: để hiển thị spinner & disable nút
    //  - socialError: hiển thị thông báo lỗi trên giao diện
    //  - setSocialError: cho phép component xóa lỗi thủ công (ví dụ khi đóng banner lỗi)
    return { handleGoogle, handleFacebook, socialLoading, socialError, setSocialError };
}