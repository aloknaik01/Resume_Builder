import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Make sure to install!
import { BlurView } from '@react-native-community/blur'; // Or Expo BlurView if using Expo

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const languages = [
  // unchanged – your language objects here
];

const LanguageSelector = () => {
  // ... all state/refs/animation code similar to your current logic

  // EXTRA: Parallax/blurred backgrounds and more lively shine
  return (
    <View style={styles.container}>
      {/* Dynamic Gradient & Particle Background */}
      <View style={styles.backgroundContainer}>
        {/* Gradient blobs */}
        <LinearGradient colors={['rgba(59,130,246,0.14)', 'rgba(16,185,129,0.12)']} style={styles.gradientBlob1}/>
        <LinearGradient colors={['rgba(234,179,8,0.13)', 'transparent']} style={styles.gradientBlob2}/>
        <LinearGradient colors={['rgba(139,92,246,0.13)', 'transparent']} style={styles.gradientBlob3}/>
        {/* Particles (stars) */}
        <Animated.View style={styles.particle1}/>
        <Animated.View style={styles.particle2}/>
        <Animated.View style={styles.particle3}/>
        <Animated.View style={styles.particle4}/>
        {/* Spotlight shimmer overlay */}
        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'transparent', 'rgba(59,130,246,0.07)']}
          start={{x: 0.2, y: 0.2}} end={{x: 1, y: 1}}
          style={styles.spotlight}
        />
      </View>

      {/* Main Content - unchanged except with glassy and animated effects where desired */}
      <View style={styles.content}>
        {/* Globe Icon with animated halo pulse */}
        <Animated.View style={[styles.iconBadge, {transform: [{scale: haloAnim}]}]}>
          <Text style={styles.iconText}>🌍</Text>
          <View style={styles.iconGlow}/>
        </Animated.View>

        {/* Animated Title with flicker */}
        <Animated.Text style={[styles.title, {opacity: titleOpacity}]}>{displayedTitle}</Animated.Text>
        {/* Subtitle with shine shimmer */}
        <Animated.Text style={[styles.subtitle, {opacity: subtitleOpacity}]}>
          {currentLanguage.subtitle}
        </Animated.Text>
        
        {/* Interactive Language Button */}
        <TouchableOpacity
          style={[styles.languageButton, {borderColor: selectedLanguage.accent + '80'}]}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.13)', 'transparent']}
            style={styles.buttonShine}
          />
          <Animated.View style={{
            transform: [{scale: pulseAnim}],
            flexDirection: 'row', alignItems: 'center',
          }}>
            <View style={[styles.flagIconContainer, {backgroundColor: selectedLanguage.accent + '33'}]}>
              <Text style={styles.flagIcon}>{selectedLanguage.flag}</Text>
            </View>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{selectedLanguage.name}</Text>
              <Text style={styles.nativeName}>{selectedLanguage.nativeName}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Info card */}
        <Animated.View style={[styles.infoCard, {opacity: infoOpacity}]}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>{currentLanguage.infoText}</Text>
        </Animated.View>
      </View>

      {/* Modal with frosted glass & BlurView */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={handleClose}>
        <Animated.View style={[styles.modalOverlay, {opacity: overlayAnim}]}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleClose}/>
          <Animated.View style={[styles.modalContent, {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}, {translateY: slideAnim}],
          }]}>
            {/* Glassy blur backdrop */}
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={Platform.OS === 'ios' ? 'light' : 'extraLight'}
              blurAmount={Platform.OS === 'ios' ? 20 : 10}
            />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>🌐</Text>
              <Animated.Text style={styles.modalTitle}>{currentLanguage.modalTitle}</Animated.Text>
              <Animated.Text style={styles.modalSubtitle}>{currentLanguage.modalSubtitle}</Animated.Text>
            </View>

            {/* Language Options - glassy ripple and animated tick */}
            <ScrollView style={styles.languageList} contentContainerStyle={styles.languageListContent}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageOption,
                    selectedLanguage.id === language.id && styles.selectedOption,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <View style={styles.languageOptionContent}>
                    <View style={[
                      styles.flagContainer,
                      selectedLanguage.id === language.id && {backgroundColor: language.accent + '33'},
                    ]}>
                      <Text style={styles.flagLarge}>{language.flag}</Text>
                      {selectedLanguage.id === language.id && (
                        <Animated.View style={[styles.flagBadge]}>
                          <Text style={styles.flagBadgeText}>✓</Text>
                        </Animated.View>
                      )}
                    </View>
                    <View style={styles.languageDetails}>
                      <Text style={styles.optionName}>{language.name}</Text>
                      <Text style={styles.optionNativeName}>{language.nativeName}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, {backgroundColor: selectedLanguage.accent}]} onPress={handleClose}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
                <Text style={styles.confirmIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // ...mostly as you had, but enhance backgrounds, gradients, glassiness, shadow etc
  spotlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  // Rest same, you can tweak colors, add BlurView styles etc
});

export default LanguageSelector;
