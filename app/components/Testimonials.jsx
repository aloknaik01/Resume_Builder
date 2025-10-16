import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import useLanguageStore from '../store/languageStore';

const StarRating = ({ count }) => (
  <View style={styles.starRow}>
    {[...Array(5)].map((_, i) => (
      <Text
        key={i}
        style={[styles.star, { color: i < count ? '#facc15' : '#6b7280' }]}
      >
        ★
      </Text>
    ))}
  </View>
);

const TestimonialCard = ({ feedback, name, role, stars }) => (
  <View style={styles.card}>
    <StarRating count={stars} />
    <Text style={styles.feedback}>"{feedback}"</Text>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.role}>{role}</Text>
  </View>
);

const Testimonials = () => {
  const { getTranslations } = useLanguageStore();
  const t = getTranslations();

  const testimonials = [
    {
      stars: 5,
      feedback: t.testimonial1,
      name: t.testimonial1Name,
      role: t.testimonial1Role,
    },
    {
      stars: 5,
      feedback: t.testimonial2,
      name: t.testimonial2Name,
      role: t.testimonial2Role,
    },
    {
      stars: 5,
      feedback: t.testimonial3,
      name: t.testimonial3Name,
      role: t.testimonial3Role,
    },
  ];

  const headingWords = t.testimonialHeading?.split(' ') || ['What', 'Workers', 'Say'];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>
        <Text style={styles.headingWhite}>{headingWords[0]} </Text>
        <Text style={styles.headingBlue}>{headingWords[1]} </Text>
        <Text style={styles.headingYellow}>{headingWords[2]}</Text>
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
        snapToInterval={260}
        decelerationRate="fast"
      >
        {testimonials.map((item, index) => (
          <TestimonialCard
            key={index}
            stars={item.stars}
            feedback={item.feedback}
            name={item.name}
            role={item.role}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 50,
    backgroundColor: '#0a0f1e',
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headingWhite: {
    color: '#fff',
  },
  headingBlue: {
    color: '#3b82f6',
    textShadowColor: 'rgba(59,130,246,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 12,
  },
  headingYellow: {
    color: '#fbbf24',
    textShadowColor: 'rgba(251,191,36,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 14,
  },
  cardsRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#1e2233',
    borderRadius: 20,
    padding: 24,
    width: 250,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    alignItems: 'flex-start',
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  star: {
    fontSize: 20,
    marginRight: 4,
  },
  feedback: {
    color: '#e0e0e0',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 24,
    minHeight: 60,
  },
  name: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 4,
  },
  role: {
    color: '#9ca3af',
    fontSize: 14,
  },
});

export default Testimonials;
