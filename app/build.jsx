import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import useLanguageStore from './store/languageStore.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BuildScreen = () => {
  const { getTranslations, selectedLanguage } = useLanguageStore();
  const t = getTranslations();
  const bt = t.build; // Build translations

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    location: '',
    jobType: '',
    experience: '',
    employer: '',
    skills: [],
    educationLevel: '',
    summary: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const steps = [
    { number: 1, label: bt.step1 },
    { number: 2, label: bt.step2 },
    { number: 3, label: bt.step3 },
    { number: 4, label: bt.step4 },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      updateFormData('skills', [...formData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    updateFormData(
      'skills',
      formData.skills.filter((s) => s !== skillToRemove)
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // Save logic here
    alert(bt.draftSaved || 'Draft saved!');
  };

  const handlePreviewDownload = () => {
    // Preview/Download logic here
    alert(bt.previewReady || 'Preview ready!');
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{bt.title}</Text>
              <Text style={styles.headerSubtitle}>{bt.subtitle}</Text>
            </View>
          </View>

          {/* Step Timeline */}
          <View style={styles.timelineContainer}>
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <View key={step.number} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineCircle,
                      isActive && styles.timelineCircleActive,
                      isCompleted && styles.timelineCircleCompleted,
                      { borderColor: selectedLanguage?.accent || '#3b82f6' },
                      (isActive || isCompleted) && {
                        backgroundColor: selectedLanguage?.accent || '#3b82f6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timelineNumber,
                        (isActive || isCompleted) && styles.timelineNumberActive,
                      ]}
                    >
                      {isCompleted ? '✓' : step.number}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      isActive && { color: selectedLanguage?.accent || '#3b82f6' },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isCompleted && {
                          backgroundColor: selectedLanguage?.accent || '#3b82f6',
                        },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>

          {/* Form Card */}
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepIcon}>👤</Text>
                  <Text style={styles.stepTitle}>{bt.step1}</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {bt.fullName} <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={bt.fullNamePlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={formData.fullName}
                    onChangeText={(text) => updateFormData('fullName', text)}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>{bt.age}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={bt.agePlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="number-pad"
                      value={formData.age}
                      onChangeText={(text) => updateFormData('age', text)}
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>{bt.gender}</Text>
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectText}>
                        {formData.gender || bt.genderPlaceholder}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>
                      {bt.phone} <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={bt.phonePlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(text) => updateFormData('phone', text)}
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>
                      {bt.email} <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder={bt.emailPlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="email-address"
                      value={formData.email}
                      onChangeText={(text) => updateFormData('email', text)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.location}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={bt.locationPlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={formData.location}
                    onChangeText={(text) => updateFormData('location', text)}
                  />
                </View>
              </View>
            )}

            {/* Step 2: Professional */}
            {currentStep === 2 && (
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepIcon}>💼</Text>
                  <Text style={styles.stepTitle}>{bt.step2}</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {bt.jobType} <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.selectContainer}>
                    <Text style={styles.selectText}>
                      {formData.jobType || bt.jobTypePlaceholder}
                    </Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.experience}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={bt.experiencePlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="number-pad"
                    value={formData.experience}
                    onChangeText={(text) => updateFormData('experience', text)}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.employer}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={bt.employerPlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={formData.employer}
                    onChangeText={(text) => updateFormData('employer', text)}
                  />
                </View>
              </View>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepIcon}>🎯</Text>
                  <Text style={styles.stepTitle}>{bt.step3}</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.addSkills}</Text>
                  <View style={styles.skillInputContainer}>
                    <TextInput
                      style={styles.skillInput}
                      placeholder={bt.skillsPlaceholder}
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={skillInput}
                      onChangeText={setSkillInput}
                      onSubmitEditing={addSkill}
                    />
                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        { backgroundColor: selectedLanguage?.accent || '#3b82f6' },
                      ]}
                      onPress={addSkill}
                    >
                      <Text style={styles.addButtonText}>{bt.add}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {formData.skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {formData.skills.map((skill, index) => (
                      <View
                        key={index}
                        style={[
                          styles.skillChip,
                          {
                            backgroundColor:
                              (selectedLanguage?.accent || '#3b82f6') + '20',
                            borderColor:
                              (selectedLanguage?.accent || '#3b82f6') + '40',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            { color: selectedLanguage?.accent || '#3b82f6' },
                          ]}
                        >
                          {skill}
                        </Text>
                        <TouchableOpacity onPress={() => removeSkill(skill)}>
                          <Text style={styles.removeSkill}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Step 4: Education */}
            {currentStep === 4 && (
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepIcon}>🎓</Text>
                  <Text style={styles.stepTitle}>{bt.step4}</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.educationLevel}</Text>
                  <View style={styles.selectContainer}>
                    <Text style={styles.selectText}>
                      {formData.educationLevel || bt.educationPlaceholder}
                    </Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{bt.summary}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={bt.summaryPlaceholder}
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={formData.summary}
                    onChangeText={(text) => updateFormData('summary', text)}
                  />
                </View>
              </View>
            )}
          </Animated.View>

          {/* Navigation Buttons */}
          <View style={styles.navigation}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                <Text style={styles.prevButtonText}>← {bt.previous}</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  {
                    backgroundColor: selectedLanguage?.accent || '#3b82f6',
                    marginLeft: currentStep === 1 ? 'auto' : 0,
                  },
                ]}
                onPress={nextStep}
              >
                <Text style={styles.nextButtonText}>
                  {bt.nextStep} →
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.finalButtons}>
                <TouchableOpacity
                  style={styles.draftButton}
                  onPress={handleSaveDraft}
                >
                  <Text style={styles.draftButtonText}>💾 {bt.saveDraft}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.downloadButton,
                    { backgroundColor: '#eab308' },
                  ]}
                  onPress={handlePreviewDownload}
                >
                  <Text style={styles.downloadButtonText}>
                    ⚡ {bt.previewDownload}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(currentStep / 4) * 100}%`,
                  backgroundColor: selectedLanguage?.accent || '#3b82f6',
                },
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  timelineItem: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  timelineCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  timelineCircleActive: {
    transform: [{ scale: 1.1 }],
  },
  timelineCircleCompleted: {
    borderColor: '#10b981',
    backgroundColor: '#10b981',
  },
  timelineNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.5)',
  },
  timelineNumberActive: {
    color: '#ffffff',
  },
  timelineLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    textAlign: 'center',
  },
  timelineLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stepContent: {
    gap: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  selectContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  skillInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  skillInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeSkill: {
    fontSize: 20,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  prevButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  prevButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalButtons: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  draftButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#0a0f1e',
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default BuildScreen;