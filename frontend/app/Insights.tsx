import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const [loading, setLoading] = useState(true);

  const [insightData, setInsightData] = useState({
    avgCycle: 26,
    avgPeriod: 7,
    totalCycles: 9,
    longestPeriod: 7,
    cycleTrend: [28, 28, 28, 28, 28, 11],
    cycleLabels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    periodDuration: [7, 7, 7, 7, 7, 6],
    periodLabels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    symptoms: [
      { name: 'Cramps', count: 16, max: 20 },
      { name: 'Fatigue', count: 6, max: 20 },
      { name: 'Bloating', count: 6, max: 20 },
      { name: 'Headache', count: 4, max: 20 },
      { name: 'Backache', count: 3, max: 20 },
    ],
    moods: [
      { name: 'Normal', count: 5 },
      { name: 'Irritable', count: 4 },
      { name: 'Tired', count: 3 },
      { name: 'Happy', count: 3 },
    ]
  });

  const API_BASE_URL = Platform.OS === 'web' 
   ? `http://localhost:5000/api` 
   : `http://192.168.8.198:5000/api`; 

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(`${API_BASE_URL}/insights/${userId}`);
        if (response.data) {
          setInsightData(response.data); 
        }
      }
    } catch (error) {
      console.log("Using fallback mock data for Insights");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cycle Insights</Text>
        <Text style={styles.headerSubtitle}>Understand your patterns</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.gridContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={28} color="#9333EA" />
            <Text style={styles.statNumber}>{insightData.avgCycle}</Text>
            <Text style={styles.statLabel}>Average Cycle Length</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={28} color="#EC4899" />
            <Text style={[styles.statNumber, { color: '#EC4899' }]}>{insightData.avgPeriod}</Text>
            <Text style={styles.statLabel}>Average Period Days</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={28} color="#10B981" />
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{insightData.totalCycles}</Text>
            <Text style={styles.statLabel}>Total Cycles Tracked</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="pulse-outline" size={28} color="#F97316" />
            <Text style={[styles.statNumber, { color: '#F97316' }]}>{insightData.longestPeriod}</Text>
            <Text style={styles.statLabel}>Longest Period</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Cycle Length Trend</Text>
          <LineChart
            data={{
              labels: insightData.cycleLabels,
              datasets: [{ data: insightData.cycleTrend }]
            }}
            width={width - 80}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#9333EA" }
            }}
            bezier
            style={{ marginVertical: 10, marginLeft: -15 }}
          />
          <Text style={styles.chartFooter}>Average: {insightData.avgCycle} days</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Period Duration</Text>
          <BarChart
            data={{
              labels: insightData.periodLabels,
              datasets: [{ data: insightData.periodDuration }]
            }}
            width={width - 80}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              barPercentage: 0.7,
            }}
            style={{ marginVertical: 10, marginLeft: -15 }}
          />
          <Text style={styles.chartFooter}>Average: {insightData.avgPeriod} days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Most Common Symptoms</Text>
          {insightData.symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomRow}>
              <View style={styles.symptomHeader}>
                <Text style={styles.symptomName}>{symptom.name}</Text>
                <Text style={styles.symptomCount}>{symptom.count}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(symptom.count / symptom.max) * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mood Patterns</Text>
          <View style={styles.gridContainer}>
            {insightData.moods.map((mood, index) => (
              <View key={index} style={styles.moodCard}>
                <Text style={styles.moodCount}>{mood.count}</Text>
                <Text style={styles.moodLabel}>{mood.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: '#FCFAFF', borderColor: '#F3E8FF', borderWidth: 1 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, marginRight: 5 }}>🤖</Text>
            <Text style={styles.cardTitle}>AI Insights</Text>
          </View>
          
          <View style={styles.aiInsightBox}>
            <Text style={styles.aiInsightText}>
              <Text style={styles.aiInsightBold}>Cycle Regularity: </Text>
              Your cycles are fairly regular with an average of {insightData.avgCycle} days.
            </Text>
          </View>
          <View style={styles.aiInsightBox}>
            <Text style={styles.aiInsightText}>
              <Text style={styles.aiInsightBold}>Next Period: </Text>
              Expected around April 27, 2026
            </Text>
          </View>
          <View style={styles.aiInsightBox}>
            <Text style={styles.aiInsightText}>
              <Text style={styles.aiInsightBold}>Common Pattern: </Text>
              You frequently experience cramps during your period.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  header: { backgroundColor: '#9333EA', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: '#E9D5FF', marginTop: 5 },
  
  scrollContent: { padding: 20 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { width: '48%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#9333EA', marginTop: 10, marginBottom: 5 },
  statLabel: { fontSize: 11, color: '#6B7280', textAlign: 'center' },

  chartCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#4C1D95', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4C1D95', marginBottom: 15 },
  chartFooter: { textAlign: 'center', color: '#6B7280', fontSize: 12, marginTop: 5 },

  symptomRow: { marginBottom: 15 },
  symptomHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  symptomName: { fontSize: 14, color: '#4B5563' },
  symptomCount: { fontSize: 14, color: '#9333EA', fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#9333EA', borderRadius: 4 },

  moodCard: { width: '48%', backgroundColor: '#FAF5FF', borderRadius: 15, padding: 15, alignItems: 'center', marginBottom: 15 },
  moodCount: { fontSize: 24, fontWeight: 'bold', color: '#9333EA', marginBottom: 5 },
  moodLabel: { fontSize: 13, color: '#4B5563' },

  aiInsightBox: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1 },
  aiInsightText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  aiInsightBold: { fontWeight: 'bold', color: '#9333EA' }
});