import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // මේවා පස්සේ අපි Backend එකෙන් ගමු. දැනට ලස්සනට පේන්න බොරු දත්ත (Dummy Data) ටිකක් දාමු.
  const [daysLeft, setDaysLeft] = useState(5);
  const [status, setStatus] = useState('Period in'); 

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 1. Header කොටස (නම සහ Notifications) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>Beautiful 👋</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
           <Ionicons name="notifications-outline" size={26} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* 2. ප්‍රධාන රවුම (Main Cycle Circle) */}
      <View style={styles.circleContainer}>
        {/* වටේට තියෙන පාට රවුම (Gradient Circle) */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.outerCircle}
        >
          {/* මැද තියෙන සුදු රවුම */}
          <View style={styles.innerCircle}>
            <Text style={styles.statusLabel}>{status}</Text>
            <Text style={styles.daysText}>{daysLeft}</Text>
            <Text style={styles.daysLabel}>Days</Text>
          </View>
        </LinearGradient>

        <Text style={styles.predictionDate}>Estimated Start: Oct 28</Text>
      </View>

      {/* 3. ලොග් කරන්න තියෙන බටන් එක */}
      <TouchableOpacity style={styles.logButton}>
        <Text style={styles.logButtonText}>Log Period Dates</Text>
      </TouchableOpacity>

      {/* 4. තොරතුරු කාඩ්පත් (Info Cards) */}
      <View style={styles.statsRow}>
        {/* Ovulation Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#E1BEE7' }]}>
             <Ionicons name="egg-outline" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statLabel}>Fertility</Text>
          <Text style={styles.statValue}>Low</Text>
        </View>
        
        {/* Cycle Day Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FFCDD2' }]}>
             <Ionicons name="calendar-outline" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statLabel}>Cycle Day</Text>
          <Text style={styles.statValue}>Day 23</Text>
        </View>
      </View>

       {/* 5. සෞඛ්‍ය උපදෙස් (Health Tips) */}
       <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Insights 💡</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Stay Hydrated!</Text>
            <Text style={styles.insightDesc}>Drinking water helps reduce bloating and cramps during your cycle.</Text>
          </View>
       </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // ලා රෝස පසුබිම
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: 'gray',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  iconButton: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  outerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125, // හරියටම රවුමක් වෙන්න width එකෙන් බාගයක්
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  innerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.white, // මැද සුදු පාටයි
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#F3E5F5',
  },
  statusLabel: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 5,
  },
  daysText: {
    fontSize: 80, // ලොකු අකුරු
    fontWeight: 'bold',
    color: Colors.primary,
  },
  daysLabel: {
    fontSize: 20,
    color: 'gray',
    fontWeight: '500',
  },
  predictionDate: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  logButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: '#E0F7FA', // ලා නිල් පාට පසුබිමක්
    padding: 20,
    borderRadius: 15,
    flexDirection: 'column',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006064',
    marginBottom: 5,
  },
  insightDesc: {
    fontSize: 14,
    color: '#006064',
    lineHeight: 20,
  },
});