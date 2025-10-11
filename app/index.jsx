import { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AnimatedBackground from './components/AnimatedBackground.jsx';



// Main Hero Component
const HeroSection = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(badgeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Badge with entrance animation */}
          <Animated.View
            style={[
              styles.badgeContainer,
              {
                opacity: badgeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.badge}>
              <View style={styles.sparkleIcon}>
                <Text style={styles.sparkleText}>✨</Text>
              </View>
              <Text style={styles.badgeText}>AI-Powered Resume Builder</Text>
            </View>
          </Animated.View>

          {/* Main Heading with slide animation */}
          <Animated.View
            style={[
              styles.headingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.heading}>Your Dream Job</Text>
            <View style={styles.headingGradientWrapper}>
              <Text style={[styles.heading, styles.headingGradient]}>
                Starts Here
              </Text>
              <View style={styles.gradientUnderline} />
            </View>
          </Animated.View>

          {/* Subheading */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text style={styles.subheading}>
              AI-powered resumes for electricians, drivers, plumbers, and skilled
              workers — in 5 minutes
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <View style={styles.buttonGlow} />
              <Text style={styles.primaryButtonText}>Create Resume Free</Text>
              <View style={styles.buttonShine} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <View style={styles.secondaryButtonBorder} />
              <Text style={styles.secondaryButtonText}>View Templates</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats/Trust Indicators */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Resumes Created</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Free Forever</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  // Animated Background
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.5,
  },
  gradientOverlay1: {
    position: 'absolute',
    top: '15%',
    left: '-10%',
    width: 500,
    height: 500,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderRadius: 250,
    transform: [{ scale: 1.5 }],
  },
  gradientOverlay2: {
    position: 'absolute',
    top: '55%',
    right: '-15%',
    width: 400,
    height: 400,
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
    borderRadius: 200,
    transform: [{ scale: 1.5 }],
  },
  gradientOverlay3: {
    position: 'absolute',
    top: '35%',
    left: '30%',
    width: 300,
    height: 300,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    borderRadius: 150,
    transform: [{ scale: 1.3 }],
  },
  linesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  connectionLine: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderRadius: 50,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  // Badge
  badgeContainer: {
    marginBottom: 28,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  sparkleIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sparkleText: {
    fontSize: 14,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Heading
  headingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 58,
    letterSpacing: -0.5,
  },
  headingGradientWrapper: {
    marginTop: 4,
    alignItems: 'center',
  },
  headingGradient: {
    color: '#3b82f6',
    textShadowColor: 'rgba(59, 130, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  gradientUnderline: {
    marginTop: 8,
    width: 120,
    height: 4,
    backgroundColor: '#eab308',
    borderRadius: 2,
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  // Subheading
  subheading: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },
  // Buttons
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  primaryButton: {
    position: 'relative',
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: '#3b82f6',
    borderRadius: 18,
    opacity: 0.3,
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
    zIndex: 1,
  },
  secondaryButton: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  secondaryButtonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
    zIndex: 1,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
});

export default HeroSection;