import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.subText}>Your personalized dashboard</Text>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardSubtitle}>View & edit your info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Customize your app</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#556270' }]}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardSubtitle}>Check alerts & messages</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>Need Help?</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // hard-coded light background
  },
  header: {
    padding: 20,
    backgroundColor: '#1A1A1A', // hard-coded dark header
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 5,
  },
  cardsContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    color: '#F0F0F0',
    fontSize: 14,
  },
  bottom: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
