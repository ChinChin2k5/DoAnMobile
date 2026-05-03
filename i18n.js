import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi }
};

i18n
  .use(initReactI18next) // Nối i18n vào React Native
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định khi mới tải app
    fallbackLng: 'en', // Nếu lỗi không tìm thấy chữ, tự động lùi về Tiếng Anh
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;