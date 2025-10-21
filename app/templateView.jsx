import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import img from '../assets/images/icon.jpg';
import rnp2 from '../assets/images/rnp2.jpg';
import rp1 from '../assets/images/rp1.jpg';
import rp2 from '../assets/images/rp2.jpg';
import AnimatedBackground from './components/AnimatedBackground';
import useLanguageStore from './store/languageStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const templatesList = [
  {
    key: 'classic',
    title: 'Classic Resume',
    subtitle: 'Clean, professional',
    accent: '#3b82f6',
    thumb: img,
  },
  {
    key: 'modern',
    title: 'Modern Resume',
    subtitle: 'Bold & contemporary',
    accent: '#8b5cf6',
    thumb: rnp2,
  },
  {
    key: 'elegant',
    title: 'Elegant Resume',
    subtitle: 'Minimal and refined',
    accent: '#f59e0b',
    thumb: rp1,
  },
  {
    key: 'creative',
    title: 'Creative Resume',
    subtitle: 'Colorful & unique',
    accent: '#10b981',
    thumb: rp2,
  },
];

const TemplateView = () => {
  const { selectedLanguage, getTranslations } = useLanguageStore();
  const t = getTranslations();
  const heading = t?.viewTemplates || t?.title || 'Choose Template';
  const subheading = t?.chooseTemplateSubtext || 'Pick a template to start building';

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;
  const cardScale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(rise, {
          toValue: 0,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleUseTemplate = (key) => {
    router.push(`/build?template=${encodeURIComponent(key)}`);
  };

  const handleStartBuilding = () => {
    router.push(`/build?template=${templatesList[0].key}`);
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <Animated.View style={[styles.header, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <Text style={styles.title}>{heading}</Text>
        <Text style={styles.subtitle}>{subheading}</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {templatesList.map((tpl) => {
            const accent = tpl.accent;
            return (
              <Animated.View key={tpl.key} style={[styles.cardWrapper, { transform: [{ scale: cardScale }] }]}>
                <TouchableOpacity
                  activeOpacity={0.92}
                  style={[styles.card, { borderColor: accent + '40' }]}
                  onPress={() => handleUseTemplate(tpl.key)}
                >
                  <View style={[styles.thumb, { backgroundColor: accent + '10' }]}>
                    {tpl.thumb ? (
                      <Image source={tpl.thumb} style={styles.thumbImage} resizeMode="cover" />
                    ) : (
                      <View style={[styles.thumbPlaceholder, { borderColor: accent + '30' }]}>
                        <Text style={[styles.thumbText, { color: accent }]}>{tpl.title}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{tpl.title}</Text>
                    <Text style={styles.cardSubtitle}>{tpl.subtitle}</Text>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={[styles.useSmallButton, { backgroundColor: accent }]}
                        onPress={() => handleUseTemplate(tpl.key)}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.useSmallButtonText}>{t?.useTemplate || 'Use This Template'}</Text>
                      </TouchableOpacity>

                      <View style={styles.previewDots}>
                        <View style={[styles.dot, { backgroundColor: accent + '80' }]} />
                        <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
                        <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
                      </View>
                    </View>
                  </View>

                  <View style={[styles.cardGlow, { backgroundColor: accent + '14' }]} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryCTA, { backgroundColor: selectedLanguage?.accent || '#3b82f6' }]}
          onPress={handleStartBuilding}
        >
          <View style={styles.primaryGlow} />
          <Text style={styles.primaryCTAText}>{t?.startBuilding || t?.createResume || 'Start Building Now'}</Text>
        </TouchableOpacity>

        <View style={{ height: 56 }} />
      </ScrollView>
    </View>
  );
};

const CARD_W = Math.min((SCREEN_WIDTH - 64) / 2, 360);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: { alignItems: 'center', marginTop: 68, marginBottom: 18, paddingHorizontal: 24, zIndex: 20 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.6 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 14.5, textAlign: 'center', marginTop: 8, paddingHorizontal: 14 },
  scrollContainer: { paddingTop: 8, paddingHorizontal: 20, alignItems: 'center' },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    paddingVertical: 18,
  },

  cardWrapper: {
    width: '48%',
    marginBottom: 18,
    alignItems: 'center',
  },

  card: {
    width: '100%',
    height: 260,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 8,
  },

  thumb: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbImage: {
    width: '100%',
    height: '100%',
  },

  thumbPlaceholder: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbText: {
    fontSize: 13,
    fontWeight: '700',
  },

  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  cardSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 6,
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  useSmallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  useSmallButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  previewDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },

  cardGlow: {
    position: 'absolute',
    left: -30,
    bottom: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.28,
    zIndex: 0,
  },

  primaryCTA: {
    marginTop: 18,
    width: Math.min(SCREEN_WIDTH - 48, 520),
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 10,
  },

  primaryCTAText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    zIndex: 2,
  },

  primaryGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
    opacity: 0.06,
  },
});

export default TemplateView;
