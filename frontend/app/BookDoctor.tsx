import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DoctorProfileScreen() {
  const router = useRouter();
  
  // Extract parameters passed from Consult / AllDoctors screens
  const params = useLocalSearchParams();
  const { id, name, specialty, rating, experience, image, hospital, location } = params;

  // --- Hospital Contact Functions ---

  const handleCallHospital = () => {
    // Replace this with the actual dynamic hospital phone number if available
    const phoneNumber = 'tel:+94112691111'; // Example: General Hospital Colombo
    Linking.openURL(phoneNumber).catch(err => Alert.alert("Error", "Could not open the dialer."));
  };

  const handleVisitWebsite = () => {
    // Replace this with the actual hospital website or booking portal link
    const websiteUrl = 'https://echannelling.com/'; 
    Linking.openURL(websiteUrl).catch(err => Alert.alert("Error", "Could not open the browser."));
  };
  
 

  return (
    <View style={styles.container}>
      {/* Top Header Section */}
      <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
  onPress={() => {
    if (router.canGoBack()) {
      router.back(); 
    } else {
      router.replace('/AllDoctors'); 
    }
  }} 
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color="white" />
</TouchableOpacity>
          <View>
             <Text style={styles.headerTitle}>Doctor Profile</Text>
             <Text style={styles.headerSubtitle}>View details & contact clinic</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Profile Card (Now naturally placed below the header without overlapping bugs) */}
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

          {/* Quick Stats Row */}
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

        {/* Doctor Details & Services Section */}
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

        {/* Clinic Location & External Contact Section */}
        <View style={styles.sectionCard}>
           <View style={styles.sectionHeader}>
              <View style={styles.dot} />
              <Text style={styles.sectionTitle}>Clinic & Contact</Text>
           </View>
           <View style={styles.locationRow}>
              <View style={styles.locationIconBox}>
                 <Ionicons name="business-outline" size={24} color="#A855F7" />
              </View>
              <View style={{ flex: 1 }}>
                 <Text style={styles.hospitalName}>{hospital || "General Hospital"}</Text>
                 <Text style={styles.hospitalAddress}>{location || "Colombo, Western"}</Text>
              </View>
           </View>
           
           {/* Hospital Connect Buttons (Call & Website) */}
           <View style={styles.contactActionRow}>
               <TouchableOpacity style={styles.contactBtn} onPress={handleCallHospital}>
                   <Ionicons name="call" size={18} color="#059669" />
                   <Text style={[styles.contactBtnText, { color: '#059669' }]}>Call Clinic</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.contactBtn} onPress={handleVisitWebsite}>
                   <Ionicons name="globe-outline" size={18} color="#2563EB" />
                   <Text style={[styles.contactBtnText, { color: '#2563EB' }]}>Visit Website</Text>
               </TouchableOpacity>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  // FIX: Reduced paddingBottom so the header is not too large
  headerBackground: { paddingTop: Platform.OS === 'android' ? 40 : 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 13, color: '#E9D5FF', marginTop: 2 },
  
  // FIX: Added paddingTop so the card sits nicely below the header
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 }, 
  
  // FIX: Removed marginTop: -40 and zIndex to prevent Android rendering overlap bugs
  mainCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, shadowColor: '#A855F7', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8, marginBottom: 20 },
  
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

  // Hospital Action Button Styles
  contactActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  contactBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 12, flex: 0.48, borderWidth: 1, borderColor: '#E2E8F0' },
  contactBtnText: { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
});