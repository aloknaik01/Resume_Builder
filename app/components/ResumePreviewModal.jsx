import { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import ResumeTemplate from './ResumePDFTemplate.jsx';

const ResumePreviewModal = ({ visible, onClose, formData, accentColor }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const viewShotRef = useRef();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Request permissions for saving to gallery
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to save resume to your device.'
        );
        setIsGenerating(false);
        return;
      }

      // Capture the view as image
      const uri = await viewShotRef.current.capture();
      
      // Generate filename
      const fileName = `Resume_${formData.fullName.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Copy to file system
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Resumes', asset, false);

      setIsGenerating(false);
      
      Alert.alert(
        'Success! ✅',
        'Resume has been saved to your gallery!',
        [
          {
            text: 'Share',
            onPress: () => handleShare(fileUri),
          },
          {
            text: 'OK',
            onPress: onClose,
          },
        ]
      );
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating resume:', error);
      Alert.alert('Error', 'Failed to generate resume. Please try again.');
    }
  };

  const handleShare = async (uri = null) => {
    try {
      setIsGenerating(true);

      let shareUri = uri;
      if (!shareUri) {
        // Capture the view as image
        shareUri = await viewShotRef.current.capture();
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device');
        setIsGenerating(false);
        return;
      }

      await Sharing.shareAsync(shareUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your resume',
      });

      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error sharing resume:', error);
      Alert.alert('Error', 'Failed to share resume. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
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
          <Text style={styles.headerTitle}>Resume Preview</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Resume Preview */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.previewContainer}>
            <ViewShot
              ref={viewShotRef}
              options={{
                format: 'png',
                quality: 1.0,
                result: 'tmpfile',
              }}
            >
              <ResumeTemplate formData={formData} />
            </ViewShot>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={accentColor || '#3b82f6'} />
              <Text style={styles.loadingText}>Generating resume...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={() => handleShare()}
              >
                <Text style={styles.shareIcon}>📤</Text>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.downloadButton,
                  { backgroundColor: accentColor || '#3b82f6' },
                ]}
                onPress={handleDownload}
              >
                <Text style={styles.downloadIcon}>⬇️</Text>
                <Text style={[styles.actionButtonText, styles.downloadText]}>
                  Download
                </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  previewContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
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
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  downloadButton: {
    backgroundColor: '#3b82f6',
  },
  shareIcon: {
    fontSize: 20,
  },
  downloadIcon: {
    fontSize: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  downloadText: {
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

export default ResumePreviewModal;