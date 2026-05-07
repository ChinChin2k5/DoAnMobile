import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi }
};

i18n
  .use(initReactI18next) // Gắn vào React
  .init({
    resources,
    compatibilityJSON: 'v3', // Rule bắt buộc cho Android
    lng: 'vi', // Cứ set mặc định là vi. Thằng LoadingScreen sẽ sửa lại sau!
    fallbackLng: 'vi', 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;