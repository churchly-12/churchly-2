import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function HomeScreen({ navigation }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  // Initialize animation based on isFlipped state
  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isFlipped ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Interpolations for front card (fades out as it flips)
  const frontScale = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.85, 0.7],
  });

  const frontOpacity = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const frontRotateY = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '45deg', '90deg'],
  });

  // Interpolations for back card (fades in as it flips)
  const backScale = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 0.85, 1],
  });

  const backOpacity = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const backRotateY = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-45deg', '0deg'],
  });

  const openMaps = () => {
    const url = 'https://www.google.com/maps?sca_esv=39fb4ce6952c9081&biw=1536&bih=643&gs_lp=Egxnd3Mtd2l6LXNlcnAiJ291ciBsYWR5IG9mIGdvb2QgaGVhbHRoIGtoYWlyYXRhYmFkIGxvYyoCCAAyBRAhGKABMgUQIRigATIFECEYoAFI3khQ9gxY_kBwBngBkAEAmAGWAqABmgmqAQUwLjQuMrgBAcgBAPgBAZgCDKAC9AnCAgoQABiwAxjWBBhHwgIOEC4YgAQYxwEYjgUYrwHCAgYQABgWGB7CAgIQJsICCxAAGIAEGIYDGIoFwgIIEAAYgAQYogTCAh0QLhiABBjHARiOBRivARiXBRjcBBjeBBjgBNgBAcICBBAhGBWYAwCIBgGQBgi6BgYIARABGBSSBwU2LjQuMqAH9iOyBwUwLjQuMrgHyAnCBwcwLjIuNy4zyAc7&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kb9lqBNBl8s7MegFMDAK9ON2&daddr=CF44%2BQCR,+Rock+Memorial+School+St,+Veer+Nagar,+Chintal,+Hyderabad,+Telangana+500004';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollContainer}>
        {/* Shrine Banner - Flip Card */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity 
            style={styles.flipCardContainer} 
            onPress={handleFlip}
            activeOpacity={1}
          >
            {/* Front Face */}
            <Animated.View 
              style={[
                styles.flipCardFront,
                {
                  opacity: frontOpacity,
                  transform: [
                    { perspective: 1000 },
                    { scale: frontScale },
                    { rotateY: frontRotateY },
                  ],
                },
              ]}
            >
              <View style={styles.frontContent}>
                <Text style={styles.shrineTitle}>Shrine of Our Lady of Health</Text>
                <Text style={styles.quote}>
                  "My soul proclaims the greatness of the Lord, and my spirit rejoices in God my Savior."
                </Text>
                <Text style={styles.cite}>— Mary (Luke 1:46-47)</Text>
                <View style={styles.divider} />
                <Text style={styles.tapHint}>Tap to see location & image</Text>
              </View>
            </Animated.View>

            {/* Back Face */}
            <Animated.View 
              style={[
                styles.flipCardBack,
                {
                  opacity: backOpacity,
                  transform: [
                    { perspective: 1000 },
                    { scale: backScale },
                    { rotateY: backRotateY },
                  ],
                },
              ]}
            >
              <View style={styles.backContent}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../../assets/church.png')}
                    style={styles.churchImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.locationTitle}>Our Lady of Health Shrine</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.emoji}>📍</Text>
                  <Text style={styles.locationText}>Hyderabad, Telangana, India</Text>
                </View>
                <TouchableOpacity style={styles.mapsButton} onPress={openMaps}>
                  <Text style={styles.emoji}>🗺️</Text>
                  <Text style={styles.mapsText}>View on Maps</Text>
                </TouchableOpacity>
                <Text style={styles.flipHint}>Tap to flip back</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Daily Verse Card */}
        <View style={styles.verseCard}>
          <Text style={styles.verseTitle}>Daily Verse</Text>
          <Text style={styles.verseText}>Psalms 23:1</Text>
          <Text style={styles.verseRef}>"Yahweh is my shepherd: I shall lack nothing."</Text>
          <Text style={styles.verseCite}>— World English Bible</Text>
        </View>

        {/* Two-card grid: Prayer + Testimonials */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PrayerWall')}>
            <Ionicons name="heart" size={32} color="#dc2626" />
            <Text style={styles.cardTitle}>Prayer Requests</Text>
            <Text style={styles.cardSubtitle}>Share a need</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Testimonials')}>
            <MaterialIcons name="star" size={32} color="#eab308" />
            <Text style={styles.cardTitle}>Testimonials</Text>
            <Text style={styles.cardSubtitle}>Praise reports</Text>
          </TouchableOpacity>
        </View>

        {/* Events Card */}
        <TouchableOpacity style={styles.eventsCard} onPress={() => navigation.navigate('Activities')}>
          <View style={styles.eventsContent}>
            <Text style={styles.emoji}>📅</Text>
            <View style={styles.eventsText}>
              <Text style={styles.eventsTitle}>Church Events</Text>
              <Text style={styles.eventsSubtitle}>Upcoming services and activities</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  scrollContainer: {
    flex: 1,
  },
  bannerContainer: {
    margin: 16,
    height: 340,
  },
  flipCardContainer: {
    flex: 1,
    width: '100%',
  },
  flipCardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flipCardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  frontContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  backContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  shrineTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b2a20',
    textAlign: 'center',
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 24,
  },
  cite: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#6b4a2d',
    borderRadius: 2,
    marginBottom: 12,
  },
  tapHint: {
    fontSize: 13,
    color: '#9ca3af',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#6b4a2d',
  },
  churchImage: {
    width: '100%',
    height: '100%',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 10,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6b4a2d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  mapsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  flipHint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  verseCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  verseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 12,
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 8,
  },
  verseRef: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 24,
  },
  verseCite: {
    fontSize: 14,
    color: '#9ca3af',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 6,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b2a20',
    marginTop: 10,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  eventsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventsText: {
    flex: 1,
    marginLeft: 12,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 4,
  },
  eventsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
