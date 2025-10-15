import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES } from '../constants/languages.js';

const STORAGE_KEY = '@app_language';

const useLanguageStore = create((set, get) => ({
  selectedLanguage: null,
  tempSelectedLanguage: null,
  currentCycleIndex: 0,
  isLanguageConfirmed: false,
  isLoading: true,

  // ✅ Confirm language
  confirmLanguage: async () => {
    const { tempSelectedLanguage } = get();
    if (tempSelectedLanguage) {
      set({
        selectedLanguage: tempSelectedLanguage,
        isLanguageConfirmed: true,
      });
      await AsyncStorage.setItem(STORAGE_KEY, tempSelectedLanguage.id);
    }
  },

  // ✅ Temporarily select language
  setTempLanguage: (language) => {
    set({ tempSelectedLanguage: language });
  },

  // ✅ Cancel selection
  cancelSelection: () => {
    const { selectedLanguage } = get();
    set({ tempSelectedLanguage: selectedLanguage });
  },

  // ✅ Update index for animation
  setCycleIndex: (index) => set({ currentCycleIndex: index }),

  // ✅ Get current cycle language (safe)
  getCurrentCycleLanguage: () => {
    try {
      const { currentCycleIndex } = get();
      if (!Array.isArray(LANGUAGES) || LANGUAGES.length === 0) return null;
      return LANGUAGES[currentCycleIndex % LANGUAGES.length];
    } catch (error) {
      console.error('Error in getCurrentCycleLanguage:', error);
      return null;
    }
  },

  // ✅ Load language from AsyncStorage
  loadLanguage: async () => {
    try {
      const savedLangId = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLangId && Array.isArray(LANGUAGES)) {
        const language = LANGUAGES.find((lang) => lang.id === savedLangId);
        if (language) {
          set({
            selectedLanguage: language,
            tempSelectedLanguage: language,
            isLanguageConfirmed: true,
            isLoading: false,
          });
          return;
        }
      }

      set({
        selectedLanguage: null,
        tempSelectedLanguage: LANGUAGES?.[0] || null,
        isLanguageConfirmed: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading language:', error);
      set({ isLoading: false });
    }
  },

  // ✅ Get all languages
  getAllLanguages: () => LANGUAGES || [],

  // ✅ Get translations for selected language
  getTranslations: () => {
    const { selectedLanguage } = get();
    return selectedLanguage?.translations || LANGUAGES?.[0]?.translations || {};
  },
}));

export default useLanguageStore;