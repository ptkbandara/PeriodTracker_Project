import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useRouter } from 'expo-router';
import axios from 'axios';
import { format, addDays, subDays, differenceInDays } from 'date-fns'; 
import { requestNotificationPermissions, schedulePeriodReminder, scheduleOvulationReminder, testNotification } from '../NotificationService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  const [userName, setUserName] = useState('Beautiful'); 
  const [loading, setLoading] = useState(true);

  // UI States
  const [daysLeft, setDaysLeft] = useState<number | string>('-');
  const [expectedDateStr, setExpectedDateStr] = useState('-');
  const [cycleDay, setCycleDay] = useState<number>(1);
  const [avgCycle, setAvgCycle] = useState(28); 
  const [periodDays, setPeriodDays] = useState(7);
  
  const [nextPeriod, setNextPeriod] = useState('-');
  const [ovulationDay, setOvulationDay] = useState('-');
  const [fertileWindow, setFertileWindow] = useState('-');
  const [currentPhase, setCurrentPhase] = useState('Luteal Phase');

  const [circleTitle, setCircleTitle] = useState('Day');
  const [circleValue, setCircleValue] = useState('1');

  const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 
  const ML_BASE_URL = Platform.OS === 'web' ? `http://localhost:8000` : `http://192.168.8.198:8000`; 

  useEffect(() => {
    
    requestNotificationPermissions();
    loadUserDataAndPredict();
  }, []);

  const loadUserDataAndPredict = async () => {
    try {
      setLoading(true);
      const name = await AsyncStorage.getItem("userName");
      const userId = await AsyncStorage.getItem("userId") || "65f1a2b3c4d5e6f7g8h9i0j1";
      
      if (name) setUserName(name);

      const dbResponse = await axios.get(`${API_BASE_URL}/cycles/${userId}`);
      const dbData = dbResponse.data;

      let cycleLengths = [28, 30, 29]; 
      let lastStart = new Date();

      if (dbData.fullHistory && dbData.fullHistory.length > 0) {
        const sortedHistory = [...dbData.fullHistory].sort((a: any, b: any) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        lastStart = new Date(sortedHistory[0].startDate);
        cycleLengths = dbData.pastCycleLengths || cycleLengths;
      }

      try {
        const mlResponse = await fetch(`${ML_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ past_cycles: cycleLengths })
        });
        const mlData = await mlResponse.json();
        const predictedDays = mlData.predicted_length || 28;

        calculateUI(lastStart, predictedDays);
      } catch (mlErr) {
        calculateUI(lastStart, 28);
      }
    } catch (error) {
      calculateUI(new Date(), 28); 
    }
  };

  const calculateUI = (lastDate: Date, predictedCycleLength: number) => {
    const today = new Date();
    setAvgCycle(predictedCycleLength); 

    const nextPeriodDate = addDays(lastDate, predictedCycleLength);
    const diffDays = differenceInDays(nextPeriodDate, today);
    
    const currentDayInCycle = differenceInDays(today, lastDate) + 1;
    const finalCycleDay = currentDayInCycle < 1 ? 1 : currentDayInCycle;
    setCycleDay(finalCycleDay);

    const ovDayNum = predictedCycleLength - 14; 

    let phase = "";
    let cTitle = "Day";
    let cValue = finalCycleDay.toString();

    if (finalCycleDay <= periodDays) { 
        phase = "Menstruation";
        cTitle = "Period";
        cValue = `Day ${finalCycleDay}`;
    } else if (finalCycleDay < ovDayNum - 2) { 
        phase = "Follicular Phase";
        cTitle = "Ovulation in";
        cValue = `${ovDayNum - finalCycleDay} Days`;
    } else if (finalCycleDay >= ovDayNum - 2 && finalCycleDay <= ovDayNum + 1) { 
        phase = "Ovulation";
        if (finalCycleDay === ovDayNum) {
            cTitle = "Ovulation";
            cValue = "Today";
        } else {
            cTitle = "Fertile";
            cValue = "Window";
        }
    } else { 
        phase = "Luteal Phase";
        cTitle = "Period in";
        cValue = `${diffDays > 0 ? diffDays : 0} Days`;
    }
    
    setCurrentPhase(phase);
    setCircleTitle(cTitle);
    setCircleValue(cValue);

    setDaysLeft(diffDays > 0 ? diffDays : 0);
    setExpectedDateStr(`Expected on ${format(nextPeriodDate, 'MMM d, yyyy')}`);

    setNextPeriod(format(nextPeriodDate, 'MMM d, yyyy'));
    setOvulationDay(format(subDays(nextPeriodDate, 14), 'MMM d, yyyy'));
    setFertileWindow(`${format(subDays(nextPeriodDate, 18), 'MMM d')} - ${format(subDays(nextPeriodDate, 13), 'MMM d')}`);

    setLoading(false);

    // 💡 2. ML එකෙන් ආපු දිනවලට හරියටම Push Notifications Schedule කරනවා
    schedulePeriodReminder(nextPeriodDate);
    scheduleOvulationReminder(subDays(nextPeriodDate, 14));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const rotationDegree = Math.min((cycleDay / avgCycle) * 360, 360);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.topBackground}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.dateText}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
          </View>
          {/* 💡 3. Bell Icon එක එබුවම Test Notification එක එන්න හැදුවා */}
          <TouchableOpacity style={styles.iconButton} onPress={testNotification}>
             <Ionicons name="notifications-outline" size={24} color="#7C3AED" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>Cycle analysis</Text>
        </View>
        
        <View style={styles.circleCard}>
          <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.analysisTopBox}>
            <View style={styles.analysisRow}>
               <Text style={styles.analysisTopText}>Next cycle in : <Text style={{fontWeight: 'bold'}}>{daysLeft} Days</Text></Text>
               <Ionicons name="leaf-outline" size={20} color="white" style={{opacity: 0.7}} />
            </View>
            <Text style={styles.analysisTopText}>Vital signs : Normal</Text>
            <Text style={styles.analysisTopText}>You're currently in : {currentPhase}</Text>
          </LinearGradient>

          <View style={styles.circleWrapper}>
            <LinearGradient
              colors={['#FB7185', '#A855F7', '#38BDF8']} 
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.gradientRing}
            >
              <View style={styles.innerWhiteCircle}>
                <View style={styles.centerPurpleCircle}>
                  <Text style={styles.centerDayText}>{circleTitle}</Text>
                  <Text style={[styles.centerNumberText, { fontSize: circleValue.length > 5 ? 32 : 55 }]}>{circleValue}</Text>
                </View>
              </View>
            </LinearGradient>
            
            <View style={[styles.thumbContainer, { transform: [{ rotate: `${rotationDegree}deg` }] }]}>
               <View style={styles.thumbIndicator}>
                  <View style={styles.thumbInner} />
               </View>
            </View>
          </View>

          <View style={styles.phaseLegendBox}>
            <View style={styles.phaseRow}>
              <View style={styles.phaseItem}><View style={[styles.phaseColor, {backgroundColor: '#FB7185'}]} /><Text style={styles.phaseText}>Luteal phase</Text></View>
              <View style={styles.phaseItem}><View style={[styles.phaseColor, {backgroundColor: '#A855F7'}]} /><Text style={styles.phaseText}>Menstruation</Text></View>
            </View>
            <View style={styles.phaseRow}>
              <View style={styles.phaseItem}><View style={[styles.phaseColor, {backgroundColor: '#818CF8'}]} /><Text style={styles.phaseText}>Ovulation</Text></View>
              <View style={styles.phaseItem}><View style={[styles.phaseColor, {backgroundColor: '#38BDF8'}]} /><Text style={styles.phaseText}>Follicular phase</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{avgCycle}</Text>
            <Text style={styles.statLabel}>Avg Cycle (ML)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{periodDays}</Text>
            <Text style={styles.statLabel}>Period Days</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.dot} />
          <Text style={styles.sectionTitle}>Predictions</Text>
        </View>
        
        <View style={styles.napkinCard}>
          <View style={styles.napkinColumn}>
            <View style={[styles.napkinIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="water" size={20} color="#0284C7" />
            </View>
            <Text style={styles.napkinLabel}>Next Period</Text>
            <Text style={styles.napkinDate}>{nextPeriod}</Text>
          </View>
          <View style={styles.napkinDivider} />
          <View style={styles.napkinColumn}>
            <View style={[styles.napkinIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="sunny" size={20} color="#DB2777" />
            </View>
            <Text style={styles.napkinLabel}>Ovulation Day</Text>
            <Text style={styles.napkinDate}>{ovulationDay}</Text>
          </View>
          <View style={styles.napkinDivider} />
          <View style={styles.napkinColumn}>
            <View style={[styles.napkinIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="flower" size={20} color="#9333EA" />
            </View>
            <Text style={styles.napkinLabel}>Fertile Window</Text>
            <Text style={styles.napkinDate}>{fertileWindow}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => router.push("/Calendar")}>
            <LinearGradient colors={['#A855F7', '#D946EF']} style={styles.actionGradient}>
              <Text style={styles.actionButtonTextPrimary}>Log Today</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push("/Insights")}>
            <Text style={styles.actionButtonTextSecondary}>View Insights</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  topBackground: { height: 280, width: '100%', position: 'absolute', top: 0, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  dateText: { fontSize: 14, color: '#E9D5FF', marginTop: 5, fontWeight: '500' },
  iconButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 },
  scrollContent: { paddingTop: 130, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginLeft: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#A855F7', marginRight: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  circleCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  analysisTopBox: { borderRadius: 16, padding: 18, marginBottom: 25 },
  analysisRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  analysisTopText: { color: 'white', fontSize: 14, marginBottom: 6, opacity: 0.9 },
  circleWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 10, width: 230, height: 230, alignSelf: 'center' },
  gradientRing: { width: 230, height: 230, borderRadius: 115, alignItems: 'center', justifyContent: 'center' },
  innerWhiteCircle: { width: 210, height: 210, borderRadius: 105, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  centerPurpleCircle: { width: 175, height: 175, borderRadius: 87.5, backgroundColor: '#A855F7', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  centerDayText: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: -2, opacity: 0.9 },
  centerNumberText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  thumbContainer: { position: 'absolute', width: 230, height: 230, alignItems: 'center' },
  thumbIndicator: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3, marginTop: -12 },
  thumbInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: 'white', borderWidth: 2, borderColor: '#A855F7' },
  phaseLegendBox: { marginTop: 30 },
  phaseRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  phaseItem: { flexDirection: 'row', alignItems: 'center', width: '48%' },
  phaseColor: { width: 16, height: 16, borderRadius: 4, marginRight: 10 },
  phaseText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { width: '48%', backgroundColor: 'white', paddingVertical: 25, borderRadius: 20, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#A855F7', marginBottom: 5 },
  statLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  napkinCard: { backgroundColor: 'white', borderRadius: 30, padding: 20, marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' },
  napkinColumn: { flex: 1, alignItems: 'center' },
  napkinIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  napkinLabel: { fontSize: 12, color: '#4B5563', marginBottom: 4 },
  napkinDate: { fontSize: 13, color: '#1F2937', fontWeight: 'bold' },
  napkinDivider: { width: 1, height: '60%', backgroundColor: '#E9D5FF' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButtonPrimary: { width: '48%', borderRadius: 20, overflow: 'hidden' },
  actionGradient: { paddingVertical: 20, alignItems: 'center' },
  actionButtonSecondary: { width: '48%', backgroundColor: 'white', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' },
  actionButtonTextPrimary: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  actionButtonTextSecondary: { color: '#9333EA', fontSize: 16, fontWeight: 'bold' },
});