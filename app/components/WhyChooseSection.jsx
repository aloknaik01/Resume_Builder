import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import useLanguageStore from '../store/languageStore.js';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, colors }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {/* Centered Icon with Glow */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={colors}
            style={styles.iconCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {icon}
          </LinearGradient>
        </View>

        {/* Text Content */}
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </Pressable>
    </Animated.View>
  );
};

const WhyChooseSection = () => {
  const { getTranslations } = useLanguageStore();
  const t = getTranslations();

  const features = [
    {
      icon: <Feather name="cpu" size={40} color="#fff" />,
      title: t.whyChoose?.feature1Title || 'AI-Powered Engine',
      description:
        t.whyChoose?.feature1Desc ||
        'Smart resume generation powered by advanced AI, optimized for job relevance.',
      colors: ['#3b82f6', '#06b6d4'],
    },
    {
      icon: <Ionicons name="phone-portrait-outline" size={42} color="#fff" />,
      title: t.whyChoose?.feature2Title || 'Seamless Experience',
      description:
        t.whyChoose?.feature2Desc ||
        'Fast, responsive, and mobile-first — works flawlessly on every screen.',
      colors: ['#8b5cf6', '#ec4899'],
    },
    {
      icon: <MaterialIcons name="lock-outline" size={44} color="#fff" />,
      title: t.whyChoose?.feature3Title || 'Secure & Private',
      description:
        t.whyChoose?.feature3Desc ||
        'No sign-up required. All your data stays securely on your device.',
      colors: ['#10b981', '#22d3ee'],
    },
  ];

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.sectionContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {t.whyChoose?.title1 || 'Why Choose'}{' '}
          <Text style={styles.gradientText}>
            {t.whyChoose?.title2 || 'AI Resume'}
          </Text>{' '}
          <Text style={styles.goldText}>
            {t.whyChoose?.title3 || 'Builder'}
          </Text>
          ?
        </Text>
        <Text style={styles.subText}>
          {t.whyChoose?.subtitle ||
            'A perfect blend of technology, privacy, and simplicity.'}
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            icon={f.icon}
            title={f.title}
            description={f.description}
            colors={f.colors}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  headerText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  gradientText: {
    color: '#3b82f6',
  },
  goldText: {
    color: '#facc15',
  },
  subText: {
    marginTop: 10,
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 28,
  },
  card: {
    width: width > 600 ? width / 3 - 50 : '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});

export default WhyChooseSection;
