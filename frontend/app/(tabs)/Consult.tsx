import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

// 💡 ඔයාගේ Backend API URL එක
const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 

export default function ConsultScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // 💡 Database එකෙන් එන Top Doctors ලාව සේව් කරගන්න State එක
  const [topDoctors, setTopDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Health Articles Data
  const articles = [
    { id: '1', title: 'How to manage period cramps naturally', readTime: '5 min read', icon: 'leaf' },
    { id: '2', title: 'Understanding your fertile window', readTime: '4 min read', icon: 'water' },
    { id: '3', title: 'Best foods for a healthy cycle', readTime: '6 min read', icon: 'nutrition' },
  ];

  // Component එක ලෝඩ් වෙද්දීම Database එකෙන් Doctors ලාව Fetch කරනවා
  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctors`);
      
      if (response.data && response.data.length > 0) {
        // 💡 Database එකෙන් එන ලිස්ට් එකෙන් මුල් 3 දෙනාව විතරක් ගන්නවා
        setTopDoctors(response.data.slice(0, 3));
      } else {
        loadFallbackData();
      }
    } catch (error) {
      console.log("Error fetching top doctors, loading fallback data...", error);
      loadFallbackData(); 
    } finally {
      setLoading(false);
    }
  };

  // Backend එක තාම රන් වෙන්නේ නැත්නම් පෙන්වන Backup Data
  const loadFallbackData = () => {
    setTopDoctors([
      { _id: '1', name: 'Dr. Hemantha Dodampahala', specialty: 'Gynecologist & Obstetrician', rating: '4.9', experience: '25 Yrs', hospital: 'Nawaloka Hospital', province: 'Western', district: 'Colombo', image: '👨‍⚕️' },
      { _id: '2', name: 'Dr. Vijith Vidyabhushana', specialty: 'Gynecologist', rating: '4.8', experience: '20 Yrs', hospital: 'Lanka Hospitals', province: 'Western', district: 'Colombo', image: '👨‍⚕️' },
      { _id: '3', name: 'Dr. (Mrs) M.S. Silva', specialty: 'Women\'s Health & Fertility', rating: '4.9', experience: '15 Yrs', hospital: 'Asiri Medical', province: 'Western', district: 'Colombo', image: '👩‍⚕️' },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.headerBackground}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consult</Text>
          <Text style={styles.headerSubtitle}>Get expert medical advice</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, hospitals, symptoms..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionHeader}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>AI Health Assistant</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.aiBannerCard} 
          activeOpacity={0.8}
          onPress={() => router.push('/Chatbot')} 
        >
          <LinearGradient colors={['#F3E8FF', '#E9D5FF']} style={styles.aiBannerGradient}>
            <View style={styles.aiIconBox}>
              <Ionicons name="chatbubbles" size={28} color="#9333EA" />
            </View>
            <View style={styles.aiBannerTextContainer}>
              <Text style={styles.aiBannerTitle}>Check your symptoms</Text>
              <Text style={styles.aiBannerDesc}>Chat with our AI expert instantly for personalized advice.</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9333EA" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHeaderLine}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>Top Specialists</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/AllDoctors')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 30, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#A855F7" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.doctorsScroll}>
            {topDoctors.map((doctor) => (
              <View key={doctor._id || doctor.id} style={styles.doctorCard}>
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

                <Text style={styles.doctorExp}>{doctor.experience} Experience</Text>
                
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => router.push({
                    pathname: "/BookDoctor",
                    params: { 
                      id: doctor._id || doctor.id, 
                      name: doctor.name, 
                      specialty: doctor.specialty, 
                      rating: doctor.rating, 
                      experience: doctor.experience, 
                      image: doctor.image, 
                      hospital: doctor.hospital,
                      location: `${doctor.district}, ${doctor.province}` 
                    }
                  })}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={[styles.sectionHeaderLine, { marginTop: 10 }]}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.dot} />
            <Text style={styles.sectionTitle}>Daily Insights</Text>
          </View>
        </View>

        {/* 💡 මෙන්න මේ කොටස තමයි ArticleView එකට යන්න වෙනස් කළේ */}
        {articles.map((article) => (
          <TouchableOpacity 
            key={article.id} 
            style={styles.articleCard} 
            activeOpacity={0.7}
            onPress={() => router.push({
              pathname: "/ArticleView",
              params: { id: article.id, title: article.title, readTime: article.readTime }
            })}
          >
            <View style={styles.articleIconBox}>
              <Ionicons name={article.icon as any} size={24} color="#A855F7" />
            </View>
            <View style={styles.articleTextContainer}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleReadTime}>{article.readTime}</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  headerBackground: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: '#E9D5FF', marginTop: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginLeft: 5 },
  sectionHeaderLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, marginLeft: 5, marginTop: 15 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A855F7', marginRight: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  seeAllText: { color: '#A855F7', fontWeight: '600', fontSize: 14 },
  aiBannerCard: { borderRadius: 20, overflow: 'hidden', elevation: 2, shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, marginBottom: 5 },
  aiBannerGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  aiIconBox: { width: 50, height: 50, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  aiBannerTextContainer: { flex: 1 },
  aiBannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#4C1D95', marginBottom: 4 },
  aiBannerDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  doctorsScroll: { paddingBottom: 15, paddingRight: 20 },
  doctorCard: { width: 170, backgroundColor: 'white', borderRadius: 20, padding: 15, marginRight: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  doctorImagePlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  doctorRatingBox: { position: 'absolute', top: 15, right: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  doctorRatingText: { fontSize: 11, fontWeight: 'bold', color: '#D97706', marginLeft: 3 },
  doctorName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  doctorSpecialty: { fontSize: 11, color: '#A855F7', marginBottom: 4, fontWeight: '500' },
  docLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, width: '100%', justifyContent: 'center' },
  docLocationText: { fontSize: 10, color: '#6B7280', marginLeft: 4 },
  doctorExp: { fontSize: 11, color: '#9CA3AF', marginBottom: 12 },
  bookButton: { width: '100%', backgroundColor: '#F3E8FF', paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  bookButtonText: { color: '#9333EA', fontWeight: 'bold', fontSize: 13 },
  articleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1, borderWidth: 1, borderColor: '#F3F4F6' },
  articleIconBox: { width: 45, height: 45, backgroundColor: '#FAF5FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  articleTextContainer: { flex: 1 },
  articleTitle: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  articleReadTime: { fontSize: 12, color: '#9CA3AF' },
});