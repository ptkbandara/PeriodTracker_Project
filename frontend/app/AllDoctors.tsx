import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

//  Backend API URL 
const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 

export default function AllDoctorsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const locationsData: Record<string, string[]> = {
    'All Provinces': ['All Districts'],
    'Western': ['All Districts', 'Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['All Districts', 'Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['All Districts', 'Galle', 'Matara', 'Hambantota'],
    'North Western': ['All Districts', 'Kurunegala', 'Puttalam'],
    'Northern': ['All Districts', 'Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'North Central': ['All Districts', 'Anuradhapura', 'Polonnaruwa'],
    'Eastern': ['All Districts', 'Trincomalee', 'Batticaloa', 'Ampara'],
    'Uva': ['All Districts', 'Badulla', 'Monaragala'],
    'Sabaragamuwa': ['All Districts', 'Ratnapura', 'Kegalle']
  };

  const provinces = Object.keys(locationsData);
  const currentDistricts = locationsData[selectedProvince] || ['All Districts'];

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict('All Districts');
  };

  
  useEffect(() => {
    fetchDoctorsFromDB();
  }, []);

  const fetchDoctorsFromDB = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctors`); 
      
      if (response.data && response.data.length > 0) {
        setAllDoctors(response.data);
      } else {
        loadFallbackData();
      }
    } catch (error) {
      console.log("Error fetching doctors, loading fallback data...", error);
      loadFallbackData(); 
    } finally {
      setLoading(false);
    }
  };

  
  const loadFallbackData = () => {
    setAllDoctors([
      { _id: '1', name: 'Dr. Hemantha Dodampahala', specialty: 'Gynecologist', rating: '4.9', experience: '25 Yrs', province: 'Western', district: 'Colombo', hospital: 'Nawaloka Hospital', image: '👨‍⚕️' },
      { _id: '2', name: 'Dr. Vijith Vidyabhushana', specialty: 'Gynecologist', rating: '4.8', experience: '20 Yrs', province: 'Western', district: 'Colombo', hospital: 'Lanka Hospitals', image: '👨‍⚕️' },
      { _id: '3', name: 'Dr. T. G. Amal Piyumantha', specialty: 'Women\'s Health', rating: '4.7', experience: '18 Yrs', province: 'Central', district: 'Kandy', hospital: 'Suwasevana Hospital', image: '👨‍⚕️' },
      { _id: '4', name: 'Dr. Chaminda Mathota', specialty: 'Gynecologist', rating: '4.9', experience: '15 Yrs', province: 'Western', district: 'Gampaha', hospital: 'Hemas Hospital', image: '👨‍⚕️' }
    ]);
  };

  const filteredDoctors = allDoctors.filter(doctor => {
    const matchProvince = selectedProvince === 'All Provinces' || doctor.province === selectedProvince;
    const matchDistrict = selectedDistrict === 'All Districts' || doctor.district === selectedDistrict;
    const matchSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doctor.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchProvince && matchDistrict && matchSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
  onPress={() => {
    if (router.canGoBack()) {
      router.back(); 
    } else {
      router.replace('/Consult'); 
    }
  }} 
  style={styles.backButton}
>
  <Ionicons name="arrow-back" size={24} color="white" />
</TouchableOpacity>
          <Text style={styles.headerTitle}>Find Specialists</Text>
          <View style={{ width: 40 }} /> 
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, hospitals..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.filterTitle}>Filter by Province</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll}>
          {provinces.map((prov, index) => (
            <TouchableOpacity 
              key={`prov-${index}`} 
              style={[styles.locationChip, selectedProvince === prov && styles.activeLocationChip]}
              onPress={() => handleProvinceSelect(prov)}
            >
              <Text style={[styles.locationChipText, selectedProvince === prov && styles.activeLocationChipText]}>
                {prov}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedProvince !== 'All Provinces' && (
          <>
            <Text style={styles.filterTitle}>Filter by District</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll}>
              {currentDistricts.map((dist, index) => (
                <TouchableOpacity 
                  key={`dist-${index}`} 
                  style={[styles.subLocationChip, selectedDistrict === dist && styles.activeSubLocationChip]}
                  onPress={() => setSelectedDistrict(dist)}
                >
                  <Text style={[styles.subLocationChipText, selectedDistrict === dist && styles.activeSubLocationChipText]}>
                    {dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={[styles.filterTitle, { marginTop: 10, marginBottom: 15 }]}>
          {loading ? 'Searching...' : `${filteredDoctors.length} ${filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found`}
        </Text>

        {/* Loading State  */}
        {loading ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#A855F7" />
            <Text style={{ marginTop: 10, color: '#6B7280' }}>Fetching real-time data...</Text>
          </View>
        ) : filteredDoctors.length > 0 ? (
          <View style={styles.doctorsGrid}>
            {filteredDoctors.map((doctor) => (
              <View key={doctor._id} style={styles.doctorCard}>
                <View style={styles.doctorImagePlaceholder}>
                  <Text style={{ fontSize: 40 }}>{doctor.image || '👨‍⚕️'}</Text>
                </View>
                <View style={styles.doctorRatingBox}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.doctorRatingText}>{doctor.rating}</Text>
                </View>
                <Text style={styles.doctorName} numberOfLines={1}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty} numberOfLines={1}>{doctor.specialty}</Text>
                
                <View style={styles.docLocationRow}>
                  <Ionicons name="business-outline" size={12} color="#6B7280" />
                  <Text style={styles.docLocationText} numberOfLines={1}>{doctor.hospital}</Text>
                </View>
                
                <View style={[styles.docLocationRow, { marginBottom: 10 }]}>
                  <Ionicons name="location-outline" size={12} color="#6B7280" />
                  <Text style={styles.docLocationText}>{doctor.district}, {doctor.province}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => router.push({
                    pathname: "/BookDoctor",
                    params: { id: doctor._id, name: doctor.name, specialty: doctor.specialty, rating: doctor.rating, experience: doctor.experience, image: doctor.image, hospital: doctor.hospital, location: `${doctor.district}, ${doctor.province}` }
                  })}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="search-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No doctors found in {selectedDistrict === 'All Districts' ? selectedProvince : selectedDistrict}.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  headerBackground: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20 },
  filterTitle: { fontSize: 15, fontWeight: 'bold', color: '#4B5563', marginBottom: 10, marginLeft: 5 },
  locationScroll: { flexDirection: 'row', marginBottom: 15 },
  locationChip: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#E9D5FF' },
  activeLocationChip: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  locationChipText: { fontSize: 14, color: '#7C3AED', fontWeight: '600' },
  activeLocationChipText: { color: 'white' },
  subLocationChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#F3E8FF', borderWidth: 1, borderColor: '#E9D5FF' },
  activeSubLocationChip: { backgroundColor: '#D946EF', borderColor: '#D946EF' },
  subLocationChipText: { fontSize: 13, color: '#9333EA', fontWeight: '500' },
  activeSubLocationChipText: { color: 'white', fontWeight: 'bold' },
  doctorsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  doctorCard: { width: '48%', backgroundColor: 'white', borderRadius: 20, padding: 15, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  doctorImagePlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  doctorRatingBox: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  doctorRatingText: { fontSize: 11, fontWeight: 'bold', color: '#D97706', marginLeft: 3 },
  doctorName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  doctorSpecialty: { fontSize: 11, color: '#A855F7', marginBottom: 6, fontWeight: '500' },
  docLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, width: '100%', justifyContent: 'center' },
  docLocationText: { fontSize: 10, color: '#6B7280', marginLeft: 4 },
  bookButton: { width: '100%', backgroundColor: '#F3E8FF', paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  bookButtonText: { color: '#9333EA', fontWeight: 'bold', fontSize: 12 },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  emptyStateText: { marginTop: 10, fontSize: 14, color: '#6B7280', fontWeight: '500' },
});