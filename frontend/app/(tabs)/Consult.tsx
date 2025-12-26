import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';


const doctors = [
  {
    id: '1',
    name: 'Dr. Dharani Rajasinghe',
    specialty: 'Gynecologist (VOG)',
    hospital: 'Asiri Surgical',
    rating: 4.8,
    image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-closed-posture_409827-254.jpg'
  },
  {
    id: '2',
    name: 'Dr. Perera',
    specialty: 'Obstetrician',
    hospital: 'Lanka Hospitals',
    rating: 4.5,
    image: 'https://img.freepik.com/free-photo/doctor-offering-medical-advice-virtual-consultation_23-2149305412.jpg'
  },
  {
    id: '3',
    name: 'Dr. Silva',
    specialty: 'Women\'s Health Specialist',
    hospital: 'Nawaloka',
    rating: 4.9,
    image: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg'
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Doctor</Text>
        <Text style={styles.headerSubtitle}>Consult best gynecologists online</Text>
      </View>

      
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.doctorImage} />
            
            <View style={styles.cardContent}>
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <Text style={styles.hospital}>🏥 {item.hospital}</Text>
              
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, 
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: Colors.primary, 
    marginBottom: 4,
  },
  hospital: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: Colors.secondary, 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});