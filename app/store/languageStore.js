import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { LANGUAGES } from '../constants/languages.js';

const STORAGE_KEY = '@app_language';

const useLanguageStore = create((set, get) => ({
  selectedLanguage: null,
  tempSelectedLanguage: null,
  currentCycleIndex: 0,
  isLanguageConfirmed: false,
  isLoading: true,

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

  setTempLanguage: (language) => {
    set({ tempSelectedLanguage: language });
  },

  cancelSelection: () => {
    const { selectedLanguage } = get();
    set({ tempSelectedLanguage: selectedLanguage });
  },

  setCycleIndex: (index) => set({ currentCycleIndex: index }),

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

  //  Load language from AsyncStorage
  loadLanguage: async () => {
    try {
      const savedLangId = await AsyncStorage.getItem(STORAGE_KEY);

      //  If user had selected language → no animation
      if (savedLangId && Array.isArray(LANGUAGES)) {
        const language = LANGUAGES.find((lang) => lang.id === savedLangId);
        if (language) {
          set({
            selectedLanguage: language,
            tempSelectedLanguage: language,
            isLanguageConfirmed: true, // confirmed user, skip animation
            isLoading: false,
          });
          return;
        }
      }

      //  If no saved language → allow animation
      set({
        selectedLanguage: null,
        tempSelectedLanguage: LANGUAGES?.[0] || null,
        isLanguageConfirmed: false, // new user, start animation
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading language:', error);
      set({
        isLoading: false,
        isLanguageConfirmed: false,
      });
    }
  },

  //  Get all languages
  getAllLanguages: () => LANGUAGES || [],

  //  Get translations for selected language
  getTranslations: () => {
    const { selectedLanguage } = get();
    return (
      selectedLanguage?.translations ||
      LANGUAGES?.[0]?.translations ||
      {}
    );
  },
}));

export default useLanguageStore;
