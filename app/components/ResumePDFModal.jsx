// app/components/ResumePDFModal.jsx
import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { generateResumeHTML } from './ResumePDFTemplate';

const ResumePDFModal = ({ visible, onClose, formData, accentColor }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Generate HTML from template
      const htmlContent = generateResumeHTML(formData);

      // Create PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      setPdfUri(uri);
      setIsGenerating(false);

      return uri;
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      return null;
    }
  };

  const handleDownload = async (uri = null) => {
    try {
      setIsGenerating(true);

      let downloadUri = uri;
      if (!downloadUri) {
        downloadUri = await generatePDF();
      }

      if (!downloadUri) return;

      // Generate filename
      const fileName = `Resume_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Copy to downloads directory
      await FileSystem.copyAsync({
        from: downloadUri,
        to: fileUri,
      });

      setIsGenerating(false);

      Alert.alert(
        'Success! ✅',
        `Resume saved as:\n${fileName}\n\nLocation: ${FileSystem.documentDirectory}`,
        [
          {
            text: 'Share Now',
            onPress: () => handleShare(fileUri),
          },
          {
            text: 'Done',
            onPress: onClose,
          },
        ]
      );
    } catch (error) {
      setIsGenerating(false);
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download PDF. Please try again.');
    }
  };

  const handleShare = async (uri = null) => {
    try {
      setIsGenerating(true);

      let shareUri = uri;
      if (!shareUri) {
        shareUri = await generatePDF();
      }

      if (!shareUri) return;

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        setIsGenerating(false);
        return;
      }

      await Sharing.shareAsync(shareUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share your resume',
        UTI: 'com.adobe.pdf',
      });

      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Failed to share PDF. Please try again.');
    }
  };

  const handlePrint = async () => {
    try {
      setIsGenerating(true);

      const htmlContent = generateResumeHTML(formData);

      await Print.printAsync({
        html: htmlContent,
      });

      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isGenerating}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resume Generator</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📄</Text>
          </View>

          <Text style={styles.title}>Generate Your Resume PDF</Text>
          <Text style={styles.subtitle}>
            Your professional resume is ready to be generated
          </Text>

          {/* Info Cards */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✓</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Professional Format</Text>
              <Text style={styles.infoText}>
                Clean, ATS-friendly PDF format
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✓</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>High Quality</Text>
              <Text style={styles.infoText}>
                Print-ready A4 size document
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✓</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Easy Sharing</Text>
              <Text style={styles.infoText}>
                Share via email, WhatsApp, or any app
              </Text>
            </View>
          </View>

          {/* Preview Data */}
          <View style={styles.dataPreview}>
            <Text style={styles.dataTitle}>Resume Details:</Text>
            <Text style={styles.dataText}>👤 {formData.fullName}</Text>
            <Text style={styles.dataText}>📧 {formData.email}</Text>
            <Text style={styles.dataText}>📞 {formData.phone}</Text>
            {formData.jobType && (
              <Text style={styles.dataText}>💼 {formData.jobType}</Text>
            )}
            {formData.skills && formData.skills.length > 0 && (
              <Text style={styles.dataText}>
                🎯 {formData.skills.length} skills added
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={accentColor || '#3b82f6'} />
              <Text style={styles.loadingText}>Generating PDF...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrint}
              >
                <Text style={styles.secondaryIcon}>🖨️</Text>
                <Text style={styles.secondaryButtonText}>Print</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleShare()}
              >
                <Text style={styles.secondaryIcon}>📤</Text>
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: accentColor || '#3b82f6' },
                ]}
                onPress={() => handleDownload()}
              >
                <Text style={styles.primaryIcon}>⬇️</Text>
                <Text style={styles.primaryButtonText}>Download</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  dataPreview: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  dataText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },
  secondaryIcon: {
    fontSize: 18,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryIcon: {
    fontSize: 20,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
});

export default ResumePDFModal;