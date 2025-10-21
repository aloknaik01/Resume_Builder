import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import useLanguageStore from './store/languageStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LanguageSelector = () => {
  const {
    selectedLanguage,
    tempSelectedLanguage,
    isLanguageConfirmed,
    currentCycleIndex,
    setCycleIndex,
    getCurrentCycleLanguage,
    setTempLanguage,
    confirmLanguage,
    cancelSelection,
    loadLanguage,
    getAllLanguages,
  } = useLanguageStore();

  const languages = getAllLanguages();

  const [modalVisible, setModalVisible] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // --- Animation  ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const infoOpacity = useRef(new Animated.Value(0)).current;
  const modalTitleOpacity = useRef(new Animated.Value(1)).current;
  const modalSubtitleOpacity = useRef(new Animated.Value(1)).current;

  const cycleIntervalRef = useRef(null);

  // Load saved language 
  useEffect(() => {
    loadLanguage();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (isLanguageConfirmed) return;

    const fullText = languages[0]?.translations?.title || 'Choose Your Language';
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedTitle(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Fade in subtitle and info
        Animated.parallel([
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(infoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();

        setTimeout(() => {
          startLanguageCycle();
        }, 3000);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [isLanguageConfirmed]);

  // Stop animation when language is confirmed
  useEffect(() => {
    if (isLanguageConfirmed) {
      if (cycleIntervalRef.current) clearTimeout(cycleIntervalRef.current);

      setDisplayedTitle(selectedLanguage?.translations?.title || '');
      setIsTyping(false);

      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(infoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [isLanguageConfirmed, selectedLanguage]);

  // --- Language cycling animation ---
  const startLanguageCycle = () => {
    if (isLanguageConfirmed || languages.length <= 1) return;

    const cycle = () => {
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(infoOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        const nextIndex = (currentCycleIndex + 1) % languages.length;
        setCycleIndex(nextIndex);
        setDisplayedTitle(languages[nextIndex]?.translations?.title || '');

        Animated.parallel([
          Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(infoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
          if (!isLanguageConfirmed) {
            cycleIntervalRef.current = setTimeout(cycle, 3000);
          }
        });
      });
    };

    cycle();
  };

  // Modal animations
  useEffect(() => {
    if (modalVisible && !isLanguageConfirmed) {
      Animated.parallel([
        Animated.timing(modalTitleOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(modalSubtitleOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        Animated.parallel([
          Animated.timing(modalTitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(modalSubtitleOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
        ]).start();
      });
    }
  }, [currentCycleIndex, modalVisible, isLanguageConfirmed]);

  // Background animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, []);

  // Modal open/close animation
  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(overlayAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 9, tension: 50, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 50, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [modalVisible]);

  const handleLanguageSelect = (language) => setTempLanguage(language);

  const handleConfirm = async () => {
    await confirmLanguage();
    setModalVisible(false);
    setTimeout(() => router.replace('/home'), 300);
  };

  const handleClose = () => {
    cancelSelection();
    setModalVisible(false);
  };

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const currentLanguage = isLanguageConfirmed ? selectedLanguage : getCurrentCycleLanguage();
  const displayLanguage = isLanguageConfirmed ? selectedLanguage : tempSelectedLanguage;

  if (!currentLanguage || !displayLanguage) return null;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <Animated.View style={[styles.gradientBlob1, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.gradientBlob2, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.gradientBlob3, { transform: [{ rotate: spin }] }]} />
        <View style={styles.particle1} />
        <View style={styles.particle2} />
        <View style={styles.particle3} />
        <View style={styles.particle4} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>🌍</Text>
          <View style={styles.iconGlow} />
        </View>

        <Animated.View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            {isTyping ? displayedTitle : currentLanguage.translations.modalTitle}
            {isTyping && <Text style={styles.cursor}>|</Text>}
          </Animated.Text>
        </Animated.View>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          {currentLanguage.translations.modalSubtitle}
        </Animated.Text>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.languageButton, { borderColor: displayLanguage.accent + '60' }]}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.buttonShine} />
            <View style={styles.languageButtonContent}>
              <View style={[styles.flagIconContainer, { backgroundColor: displayLanguage.accent + '20' }]}>
                <Text style={styles.flagIcon}>{displayLanguage.flag}</Text>
              </View>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>{displayLanguage.name}</Text>
                <Text style={styles.nativeName}>{displayLanguage.nativeName}</Text>
              </View>
              <View style={styles.chevronContainer}>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
            <View style={[styles.buttonGlow, { backgroundColor: displayLanguage.accent + '15' }]} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.infoCard, { opacity: infoOpacity }]}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>{currentLanguage.translations.infoText}</Text>
        </Animated.View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={handleClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: overlayAnim }]}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleClose} />

          <Animated.View
            style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalDragIndicator} />
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalIcon}>🌐</Text>
                <Animated.Text style={[styles.modalTitle, { opacity: modalTitleOpacity }]}>
                  {currentLanguage.translations.modalTitle}
                </Animated.Text>
              </View>
              <Animated.Text style={[styles.modalSubtitle, { opacity: modalSubtitleOpacity }]}>
                {currentLanguage.translations.modalSubtitle}
              </Animated.Text>
            </View>

            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false} contentContainerStyle={styles.languageListContent}>
              {languages.map((language) => {
                const isSelected = tempSelectedLanguage?.id === language.id;
                return (
                  <TouchableOpacity
                    key={language.id}
                    style={[styles.languageOption, isSelected && styles.selectedOption, isSelected && { borderColor: language.accent + '80' }]}
                    activeOpacity={0.7}
                    onPress={() => handleLanguageSelect(language)}
                  >
                    {isSelected && <View style={[styles.selectedGlow, { backgroundColor: language.accent + '10' }]} />}
                    <View style={styles.languageOptionContent}>
                      <View style={[styles.flagContainer, isSelected && { backgroundColor: language.accent + '25', borderColor: language.accent + '40' }]}>
                        <Text style={styles.flagLarge}>{language.flag}</Text>
                        {isSelected && (
                          <View style={[styles.flagBadge, { backgroundColor: language.accent }]}>
                            <Text style={styles.flagBadgeText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.languageDetails}>
                        <Text style={[styles.optionName, isSelected && { color: language.accent }]}>{language.name}</Text>
                        <Text style={styles.optionNativeName}>{language.nativeName}</Text>
                      </View>
                      {isSelected && (
                        <View style={[styles.checkmark, { backgroundColor: language.accent }]}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} activeOpacity={0.8} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>{currentLanguage.translations.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.confirmButton, { backgroundColor: tempSelectedLanguage?.accent || '#3b82f6' }]} activeOpacity={0.8} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>{currentLanguage.translations.confirm}</Text>
                <Text style={styles.confirmIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default LanguageSelector;



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  backgroundContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  gradientBlob1: { position: 'absolute', top: '-5%', left: '-15%', width: 450, height: 450, backgroundColor: 'rgba(59, 130, 246, 0.12)', borderRadius: 225, opacity: 0.8 },
  gradientBlob2: { position: 'absolute', bottom: '5%', right: '-20%', width: 400, height: 400, backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: 200, opacity: 0.6 },
  gradientBlob3: { position: 'absolute', top: '40%', left: '20%', width: 300, height: 300, backgroundColor: 'rgba(139, 92, 246, 0.08)', borderRadius: 150, opacity: 0.7 },
  particle1: { position: 'absolute', top: '20%', right: '15%', width: 6, height: 6, backgroundColor: 'rgba(59, 130, 246, 0.6)', borderRadius: 3 },
  particle2: { position: 'absolute', top: '60%', left: '10%', width: 8, height: 8, backgroundColor: 'rgba(234, 179, 8, 0.5)', borderRadius: 4 },
  particle3: { position: 'absolute', top: '35%', right: '25%', width: 5, height: 5, backgroundColor: 'rgba(139, 92, 246, 0.6)', borderRadius: 2.5 },
  particle4: { position: 'absolute', bottom: '25%', left: '30%', width: 7, height: 7, backgroundColor: 'rgba(16, 185, 129, 0.5)', borderRadius: 3.5 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
  iconBadge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(59, 130, 246, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.3)', position: 'relative' },
  iconGlow: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(59, 130, 246, 0.2)', top: -5, left: -5, zIndex: -1 },
  iconText: { fontSize: 40 },
  titleContainer: { minHeight: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', letterSpacing: -0.5 },
  cursor: { opacity: 0.8, color: '#3b82f6' },
  subtitle: { fontSize: 15, color: 'rgba(255, 255, 255, 0.65)', marginBottom: 48, textAlign: 'center', lineHeight: 22, paddingHorizontal: 12, minHeight: 44 },
  languageButton: { width: SCREEN_WIDTH - 56, maxWidth: 420, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 24, borderWidth: 2, overflow: 'hidden', position: 'relative' },
  buttonShine: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  languageButtonContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 22, paddingHorizontal: 20, zIndex: 2 },
  buttonGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  flagIconContainer: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)' },
  flagIcon: { fontSize: 36 },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginBottom: 4, letterSpacing: 0.3 },
  nativeName: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500' },
  chevronContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.08)', alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 28, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, marginTop: 32, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' },
  infoIcon: { fontSize: 18, marginRight: 10 },
  infoText: { fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', fontWeight: '500', flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.88)', justifyContent: 'flex-end' },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: { backgroundColor: '#151b2e', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingTop: 16, paddingBottom: 32, maxHeight: SCREEN_HEIGHT * 0.8 },
  modalDragIndicator: { width: 48, height: 5, backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 3, alignSelf: 'center', marginBottom: 24 },
  modalHeader: { paddingHorizontal: 28, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.08)' },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  modalIcon: { fontSize: 28, marginRight: 10 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', letterSpacing: -0.3 },
  modalSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.65)', textAlign: 'center', lineHeight: 20 },
  languageList: { paddingHorizontal: 24 },
  languageListContent: { paddingTop: 24, paddingBottom: 12 },
  languageOption: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 20, marginBottom: 14, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden', position: 'relative' },
  selectedOption: { backgroundColor: 'rgba(59, 130, 246, 0.08)', transform: [{ scale: 1.02 }] },
  languageOptionContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 18, zIndex: 2 },
  selectedGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  flagContainer: { width: 64, height: 64, backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)', position: 'relative' },
  flagLarge: { fontSize: 32 },
  flagBadge: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#151b2e' },
  flagBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  languageDetails: { flex: 1 },
  optionName: { fontSize: 19, fontWeight: '700', color: '#ffffff', marginBottom: 4, letterSpacing: 0.2 },
  optionNativeName: { fontSize: 15, color: 'rgba(255, 255, 255, 0.65)', fontWeight: '500' },
  checkmark: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  checkmarkText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 20, gap: 12 },
  actionButton: { flex: 1, paddingVertical: 16, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  cancelButton: { backgroundColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.15)' },
  cancelButtonText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  confirmButton: { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  confirmButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.3, marginRight: 6 },
  confirmIcon: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});