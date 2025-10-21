import { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import useLanguageStore from '../store/languageStore';

export default function FloatingLanguageButton() {
  const { getAllLanguages } = useLanguageStore();
  const languages = getAllLanguages();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Fade animation for language cycling
  useEffect(() => {
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true })
      ]).start(() => {
        setCurrentIndex((prev) => (prev + 1) % languages.length);
      });
    };

    const interval = setInterval(cycle, 3000);
    return () => clearInterval(interval);
  }, [languages.length]);

  // Pulse animation for glow effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Icon rotate animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { 
        toValue: 1, 
        duration: 8000, 
        useNativeDriver: true 
      })
    ).start();
  }, []);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();

    if (router.pathname === '/') return;
    router.push('/');
  };

  const currentLang = languages[currentIndex];
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* Pulsing glow background */}
      <Animated.View 
        style={[
          styles.glowOuter, 
          { 
            backgroundColor: currentLang?.accent || '#3b82f6',
            transform: [{ scale: pulseAnim }] 
          }
        ]} 
      />
      
      <TouchableOpacity 
        style={[
          styles.button,
          { 
            borderColor: currentLang?.accent + '80' || 'rgba(59, 130, 246, 0.8)',
            backgroundColor: 'rgba(10, 15, 30, 0.95)'
          }
        ]}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        {/* Inner glow */}
        <View 
          style={[
            styles.innerGlow, 
            { backgroundColor: currentLang?.accent + '15' || 'rgba(59, 130, 246, 0.15)' }
          ]} 
        />
        
        {/* Flag with rotate animation */}
        <Animated.Text style={[styles.flag, { transform: [{ rotate: spin }] }]}>
          🌐
        </Animated.Text>
        
        {/* Language name with fade */}
        <Animated.Text 
          style={[
            styles.text, 
            { 
              opacity: fadeAnim,
              color: currentLang?.accent || '#3b82f6'
            }
          ]}
        >
          {currentLang?.name}
        </Animated.Text>

        {/* Shimmer effect */}
        <View style={styles.shimmer} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    zIndex: 9999,
  },
  glowOuter: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 32,
    opacity: 0.2,
    zIndex: -1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 2.5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  flag: {
    fontSize: 22,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
});
