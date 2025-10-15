import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import useLanguageStore from './store/languageStore.js';

const TemplateView = () => {
  const { selectedLanguage } = useLanguageStore();
  const language = selectedLanguage?.translations || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 8 }),
    ]).start();
  }, []);

  const handleStartBuilding = () => {
    router.push('/build');
  };

  const templates = [
    { id: 1, title: 'Classic Resume', color: '#3b82f6' },
    { id: 2, title: 'Modern Resume', color: '#8b5cf6' },
    { id: 3, title: 'Elegant Resume', color: '#f59e0b' },
    { id: 4, title: 'Creative Resume', color: '#10b981' },
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.heading}>{language.viewTemplates || 'Choose Your Template'}</Text>
        <Text style={styles.subHeading}>
          {language.chooseTemplateSubtext || 'Select a template to get started'}
        </Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.templateGrid}>
          {templates.map((tpl) => (
            <Animated.View key={tpl.id} style={[styles.card, { borderColor: tpl.color + '80' }]}>
              <View style={[styles.cardGlow, { backgroundColor: tpl.color + '20' }]} />
              <Text style={styles.cardTitle}>{tpl.title}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.useButton, { backgroundColor: tpl.color }]}
                onPress={() => router.push('/build')}
              >
                <Text style={styles.useButtonText}>{language.useTemplate || 'Use This Template'}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.startButton}
          onPress={handleStartBuilding}
        >
          <Text style={styles.startButtonText}>{language.startBuilding || 'Start Building Now'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  header: { alignItems: 'center', marginTop: 70, marginBottom: 30 },
  heading: { fontSize: 30, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 6 },
  subHeading: { color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', paddingHorizontal: 40 },
  scrollContainer: { alignItems: 'center', paddingBottom: 80 },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  card: {
    width: 160,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    zIndex: 2,
  },
  useButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    zIndex: 2,
  },
  useButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  startButton: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 24,
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TemplateView;
