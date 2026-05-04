import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 

export default function BookDoctorScreen() {
  const router = useRouter();
  
  // Consult / AllDoctors පේජ් එකෙන් එවන විස්තර
  const params = useLocalSearchParams();
  const { id, name, specialty, rating, experience, image, hospital, location } = params;

  const [selectedDate, setSelectedDate] = useState('28');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = [
    { day: 'Mon', date: '27' },
    { day: 'Tue', date: '28' },
    { day: 'Wed', date: '29' },
    { day: 'Thu', date: '30' },
    { day: 'Fri', date: '01' },
    { day: 'Sat', date: '02' },
  ];

  const availableTimes = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'];

  const handleBooking = async () => {
    try {
      setIsSubmitting(true);
      const userId = await AsyncStorage.getItem("userId") || "65f1a2b3c4d5e6f7g8h9i0j1";

      const appointmentData = {
        userId: userId,
        doctorId: id,
        doctorName: name,
        hospital: hospital || "General Hospital",
        date: `April ${selectedDate}`,
        time: selectedTime
      };

      await axios.post(`${API_BASE_URL}/appointments/book`, appointmentData);

      Alert.alert(
        "Booking Confirmed! 🎉", 
        `Your appointment with ${name} is successfully scheduled.`,
        [{ text: "Great!", onPress: () => router.back() }]
      );
    } catch (error) {
      console.log("Booking error:", error);
      Alert.alert("Error", "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
             <Text style={styles.headerTitle}>Book Appointment</Text>
             <Text style={styles.headerSubtitle}>View details and schedule</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card (Overlapping Header) */}
        <View style={styles.mainCard}>
          <View style={styles.profileRow}>
             <View style={styles.doctorImagePlaceholder}>
               <Text style={{ fontSize: 45 }}>{image || '👩‍⚕️'}</Text>
             </View>
             <View style={styles.profileInfo}>
               <Text style={styles.doctorName}>{name || 'Dr. Emily Carter'}</Text>
               <Text style={styles.doctorSpecialty}>{specialty || 'Obstetrician'}</Text>
               <View style={styles.ratingRow}>
                 <Ionicons name="star" size={14} color="#F59E0B" />
                 <Text style={styles.ratingText}>{rating || '4.8'}</Text>
                 <Text style={styles.reviewsText}>(248 reviews)</Text>
               </View>
             </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
             <View style={styles.statBox}>
                <Ionicons name="ribbon-outline" size={22} color="#A855F7" />
                <Text style={styles.statLabel}>Experience</Text>
                <Text style={styles.statValue}>{experience || '8+ Years'}</Text>
             </View>
             <View style={styles.statBox}>
                <Ionicons name="people-outline" size={22} color="#A855F7" />
                <Text style={styles.statLabel}>Patients</Text>
                <Text style={styles.statValue}>1,200+</Text>
             </View>
          </View>
        </View>

        {/* Doctor Details (About & Services merged for compact view) */}
        <View style={styles.sectionCard}>
           <View style={styles.sectionHeader}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>About & Services</Text>
           </View>
           <Text style={styles.aboutText}>
             {name} is a board-certified specialist with over {experience} of experience. Specializes in reproductive health, pregnancy care, and general consultations.
           </Text>
           <View style={{ marginTop: 10 }}>
             <View style={styles.serviceItem}><View style={styles.smallDot}/><Text style={styles.serviceText}>Specialized Consultations</Text></View>
             <View style={styles.serviceItem}><View style={styles.smallDot}/><Text style={styles.serviceText}>Health Monitoring</Text></View>
           </View>
        </View>

        {/* Clinic Location */}
        <View style={styles.sectionCard}>
           <View style={styles.sectionHeader}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>Clinic Location</Text>
           </View>
           <View style={styles.locationRow}>
              <View style={styles.locationIconBox}>
                 <Ionicons name="location-outline" size={24} color="#A855F7" />
              </View>
              <View style={{ flex: 1 }}>
                 <Text style={styles.hospitalName}>{hospital || "General Hospital"}</Text>
                 <Text style={styles.hospitalAddress}>{location || "Colombo, Western"}</Text>
              </View>
           </View>
        </View>

        {/* --- SCHEDULE SECTION --- */}
        <View style={styles.sectionHeaderLine}>
           <View style={styles.dot} />
           <Text style={styles.sectionTitle}>Select Schedule</Text>
        </View>

        {/* Date Selection */}
        <Text style={styles.subTitle}>April 2026</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {availableDates.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.dateCard, selectedDate === item.date && styles.selectedDateCard]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[styles.dayText, selectedDate === item.date && styles.selectedText]}>{item.day}</Text>
              <Text style={[styles.dateNumberText, selectedDate === item.date && styles.selectedText]}>{item.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Selection */}
        <Text style={[styles.subTitle, { marginTop: 15 }]}>Available Time</Text>
        <View style={styles.timeGrid}>
          {availableTimes.map((time, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.timeCard, selectedTime === time && styles.selectedTimeCard]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Booking Button */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && { opacity: 0.7 }]} 
          onPress={handleBooking}
          disabled={isSubmitting}
        >
          <LinearGradient colors={['#A855F7', '#D946EF']} style={styles.confirmGradient}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking • {selectedTime}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBackground: { paddingTop: 60, paddingBottom: 60, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 13, color: '#E9D5FF', marginTop: 2 },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  
  mainCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, marginTop: -40, shadowColor: '#A855F7', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5, marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  doctorImagePlaceholder: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  doctorSpecialty: { fontSize: 13, color: '#A855F7', fontWeight: '500', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginLeft: 4, marginRight: 5 },
  reviewsText: { fontSize: 12, color: '#64748B' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 15, padding: 15 },
  statBox: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 11, color: '#64748B', marginTop: 5, marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: 'bold', color: '#A855F7' },

  sectionCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A855F7', marginRight: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  
  aboutText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  smallDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D946EF', marginRight: 10 },
  serviceText: { fontSize: 13, color: '#475569' },

  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  hospitalName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  hospitalAddress: { fontSize: 12, color: '#64748B' },

  sectionHeaderLine: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  subTitle: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 10 },

  dateScroll: { flexDirection: 'row' },
  dateCard: { width: 65, height: 80, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  selectedDateCard: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  dayText: { fontSize: 12, color: '#64748B', marginBottom: 5 },
  dateNumberText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  timeCard: { width: '31%', backgroundColor: 'white', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  selectedTimeCard: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  timeText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  selectedText: { color: 'white' },

  bottomFooter: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  confirmButton: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  confirmGradient: { paddingVertical: 18, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});