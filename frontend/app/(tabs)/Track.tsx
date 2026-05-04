import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO, addDays, subDays } from 'date-fns'; // 💡 මෙතන addDays, subDays අලුතින් එකතු කළා
import { Calendar } from 'react-native-calendars';

export default function TrackScreen() {
  const [activeTab, setActiveTab] = useState('Flow');
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [selectedFlow, setSelectedFlow] = useState<string | null>('Medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>('Normal');

  const [recentCycles, setRecentCycles] = useState<any[]>([]);
  const [pastCyclesCount, setPastCyclesCount] = useState(0);
  const [loadingCycles, setLoadingCycles] = useState(true);

  const [predictions, setPredictions] = useState({
    averageCycleLength: 28,
    averagePeriodDuration: 7,
    nextPeriodDate: '',
    fertileWindowStart: '',
    fertileWindowEnd: ''
  });

  const [isInsightsVisible, setIsInsightsVisible] = useState(false);
  
  // Flo App Style Calendar Selection
  const [cycleStep, setCycleStep] = useState(0); 
  const [draftStart, setDraftStart] = useState<string | null>(null);
  const [draftEnd, setDraftEnd] = useState<string | null>(null);

  const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 
  const ML_BASE_URL = Platform.OS === 'web' ? `http://localhost:8000` : `http://192.168.8.198:8000`;

  const symptomsList = [
    { name: 'Cramps', image: require('../../assets/images/cramp.jpeg') }, 
    { name: 'Headache', image: require('../../assets/images/headache.jpeg') },
    { name: 'Backache', image: require('../../assets/images/backache.jpeg') },
    { name: 'Bloating', image: require('../../assets/images/bloating.jpeg') },
    { name: 'Fatigue', image: require('../../assets/images/fatigue.jpeg') },
    { name: 'Tender Breasts', image: require('../../assets/images/tender breasts.jpeg') },
    { name: 'Nausea', image: require('../../assets/images/nausea.jpeg') },
    { name: 'Acne', image: require('../../assets/images/acne.jpeg') }
  ];

  const moodsList = [
    { name: 'Happy', image: require('../../assets/images/happy.jpeg') },
    { name: 'Normal', image: require('../../assets/images/normal.jpeg') },
    { name: 'Sad', image: require('../../assets/images/sad.jpeg') },
    { name: 'Anxious', image: require('../../assets/images/anxious.jpeg') },
    { name: 'Irritable', image: require('../../assets/images/irritable.jpeg') },
    { name: 'Tired', image: require('../../assets/images/tired.jpeg') }
  ];

  const remediesData: { [key: string]: string } = {
    'Cramps': 'Apply a heating pad to your lower abdomen and drink warm chamomile or ginger tea.',
    'Headache': 'Rest in a quiet, dark room. Stay hydrated and try a cold compress on your forehead.',
    'Backache': 'Take a warm bath or try gentle yoga stretches. A gentle massage can also help.',
    'Bloating': 'Avoid salty foods and carbonated drinks. Peppermint tea can help soothe your stomach.',
    'Fatigue': 'Ensure you get enough sleep (8 hours). Eat iron-rich foods and take short power naps.',
    'Tender Breasts': 'Wear a comfortable, supportive bra and reduce caffeine intake temporarily.',
    'Nausea': 'Sip on ginger ale or ginger tea. Eat small, bland meals like crackers or toast.',
    'Acne': 'Wash your face with a gentle cleanser. Stay hydrated and avoid touching your skin.'
  };

  useEffect(() => {
    fetchDataAndPredict();
  }, []);

  // 💡 දින ගණනය කිරීමේ වැරැද්ද නිවැරදි කළ Function එක
  const fetchDataAndPredict = async () => {
    try {
      setLoadingCycles(true);
      const userId = await AsyncStorage.getItem("userId") || "65f1a2b3c4d5e6f7g8h9i0j1";
      
      const dbResponse = await axios.get(`${API_BASE_URL}/cycles/${userId}`);
      const dbData = dbResponse.data;

      let cycleLengths = [28, 30, 29]; 
      let lastStart = new Date();

      if (dbData.fullHistory && dbData.fullHistory.length > 0) {
        setRecentCycles(dbData.fullHistory);
        setPastCyclesCount(dbData.fullHistory.length);
        cycleLengths = dbData.pastCycleLengths || cycleLengths;
        
        // අලුත්ම Period දවස (Latest Date) හොයාගැනීම
        const sortedHistory = [...dbData.fullHistory].sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        lastStart = new Date(sortedHistory[0].startDate);
      }

      try {
        const mlResponse = await fetch(`${ML_BASE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ past_cycles: cycleLengths })
        });
        const mlData = await mlResponse.json();
        const predictedDays = mlData.predicted_length || 28;

        // date-fns හරහා නිවැරදිව දින ගණනය කිරීම
        const nextP = addDays(lastStart, predictedDays);
        const fStart = subDays(nextP, 18);
        const fEnd = subDays(nextP, 13);

        setPredictions({
          averageCycleLength: predictedDays,
          averagePeriodDuration: 7,
          nextPeriodDate: format(nextP, 'yyyy-MM-dd'),
          fertileWindowStart: format(fStart, 'yyyy-MM-dd'),
          fertileWindowEnd: format(fEnd, 'yyyy-MM-dd')
        });
      } catch (mlErr) {
        console.log("ML Server Error, using defaults");
      }

    } catch (error) {
      console.log("Failed to load cycles");
    } finally {
      setLoadingCycles(false);
    }
  };

  const handleAddCycle = async () => {
    if (!draftStart || !draftEnd) return;
    try {
      const userId = await AsyncStorage.getItem("userId") || "65f1a2b3c4d5e6f7g8h9i0j1";
      await axios.post(`${API_BASE_URL}/cycles/add`, { userId, startDate: draftStart, endDate: draftEnd, cycleLength: 28 });
      fetchDataAndPredict(); 
      setCycleStep(0);
      setDraftStart(null);
      setDraftEnd(null);
      Alert.alert("Success", "Period cycle saved successfully! 🌸");
    } catch (error) {
      Alert.alert("Error", "Failed to save cycle.");
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setIsInsightsVisible(false);
  };

  const saveDailyLog = async () => {
    setIsInsightsVisible(true);
    try {
      const userId = await AsyncStorage.getItem("userId") || "65f1a2b3c4d5e6f7g8h9i0j1"; 
      const logData = { userId, date: currentDate, flow: selectedFlow, symptoms: selectedSymptoms, mood: selectedMood };
      await axios.post(`${API_BASE_URL}/track/daily`, logData);
    } catch (error) {}
  };

  const getMarkedDates = () => {
    let marks: any = {};

    if (predictions.fertileWindowStart && predictions.fertileWindowEnd) {
      let curr = new Date(predictions.fertileWindowStart);
      let end = new Date(predictions.fertileWindowEnd);
      while (curr <= end) {
        marks[format(curr, 'yyyy-MM-dd')] = { isFertile: true };
        curr.setDate(curr.getDate() + 1);
      }
    }

    if (predictions.nextPeriodDate) {
      let curr = new Date(predictions.nextPeriodDate);
      let end = new Date(curr);
      end.setDate(end.getDate() + predictions.averagePeriodDuration - 1);
      while (curr <= end) {
        marks[format(curr, 'yyyy-MM-dd')] = { isPredicted: true };
        curr.setDate(curr.getDate() + 1);
      }
    }

    recentCycles.forEach(cycle => {
      let curr = new Date(cycle.startDate);
      let end = new Date(cycle.endDate);
      while (curr <= end) {
        marks[format(curr, 'yyyy-MM-dd')] = { isPeriod: true };
        curr.setDate(curr.getDate() + 1);
      }
    });

    if (cycleStep > 0 && draftStart) {
      let curr = new Date(draftStart);
      let end = new Date(draftEnd || draftStart);
      while (curr <= end) {
        marks[format(curr, 'yyyy-MM-dd')] = { isDraft: true };
        curr.setDate(curr.getDate() + 1);
      }
    }

    if (marks[currentDate] && cycleStep === 0) {
      marks[currentDate] = { ...marks[currentDate], isSelected: true };
    } else if (cycleStep === 0) {
      marks[currentDate] = { isSelected: true };
    }

    return marks;
  };

  const handleDayPress = (day: any) => {
    const dStr = day.dateString;
    setCurrentDate(dStr);
    setIsInsightsVisible(false);

    if (cycleStep === 1) {
      setDraftStart(dStr);
      setDraftEnd(dStr);
      setCycleStep(2);
    } else if (cycleStep === 2) {
      if (new Date(dStr) < new Date(draftStart!)) {
        setDraftStart(dStr);
        setDraftEnd(dStr);
      } else {
        setDraftEnd(dStr);
      }
    }
  };

  const healthData = () => {
    if (selectedSymptoms.length >= 3 || (selectedFlow === 'Heavy' && selectedSymptoms.length >= 2)) {
      return { title: "Doctor Consultation Recommended", message: "You have logged multiple severe symptoms today. We highly advise you to consult a gynecologist.", color: "#EF4444", icon: "alert-circle", bgColor: "#FEF2F2", borderColor: "#FECACA" };
    }
    return { title: "You are doing fine! 🌸", message: "Your symptoms are normal for this phase. Drink plenty of water and get some rest.", color: "#10B981", icon: "heart", bgColor: "#ECFDF5", borderColor: "#A7F3D0" };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Period Calendar</Text>
        <Text style={styles.headerSubtitle}>Track your cycle history</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Interactive Custom Calendar */}
        <View style={styles.card}>
          {loadingCycles ? (
            <ActivityIndicator size="large" color="#A855F7" style={{ marginVertical: 30 }} />
          ) : (
            <Calendar
              current={currentDate}
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              theme={{
                calendarBackground: 'transparent',
                textSectionTitleColor: '#9CA3AF',
                monthTextColor: '#4C1D95',
                textMonthFontWeight: 'bold',
                arrowColor: '#A855F7',
              }}
              
              dayComponent={({ date, state, marking }) => {
                const mark: any = marking || {};
                let bgStyle: any = {};
                let txtStyle: any = { color: '#374151', fontSize: 14, fontWeight: '500' };
                let icon = null;

                if (mark.isSelected || mark.isDraft) {
                  bgStyle = { backgroundColor: '#A855F7' };
                  txtStyle = { color: 'white', fontSize: 14, fontWeight: 'bold' };
                } else if (mark.isPeriod) {
                  bgStyle = { backgroundColor: '#D946EF' }; 
                  txtStyle = { color: 'white', fontSize: 14, fontWeight: 'bold' };
                  icon = <Ionicons name="water" size={12} color="white" style={styles.iconBadge} />;
                } else if (mark.isFertile) {
                  bgStyle = { backgroundColor: '#F3E8FF' }; 
                  txtStyle = { color: '#6D28D9', fontSize: 14, fontWeight: 'bold' };
                  icon = <Ionicons name="heart" size={12} color="#6D28D9" style={styles.iconBadge} />;
                } else if (mark.isPredicted) {
                  bgStyle = { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#FBCFE8', borderStyle: 'dashed' };
                  txtStyle = { color: '#BE185D', fontSize: 14, fontWeight: 'bold' };
                }

                if (state === 'disabled') {
                  txtStyle.color = '#D1D5DB';
                }

                return (
                  <TouchableOpacity onPress={() => handleDayPress(date)} style={styles.dayCellContainer}>
                    <View style={[styles.dayCircle, bgStyle]}>
                      <Text style={txtStyle}>{date?.day}</Text>
                      {icon}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Flo-style Interactive Logging UI */}
          <View style={styles.interactiveLogBox}>
            {cycleStep === 0 ? (
              <TouchableOpacity style={styles.logPeriodBtn} onPress={() => setCycleStep(1)}>
                <Text style={styles.logPeriodBtnText}>Log Period Dates</Text>
                <Ionicons name="water" size={18} color="white" style={{marginLeft: 5}}/>
              </TouchableOpacity>
            ) : cycleStep === 1 ? (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>👆 Tap your <Text style={{fontWeight:'bold', color:'#A855F7'}}>Start Date</Text> on the calendar</Text>
                <TouchableOpacity onPress={() => setCycleStep(0)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              </View>
            ) : (
              <View style={styles.promptBox}>
                <Text style={styles.promptText}>👆 Now tap your <Text style={{fontWeight:'bold', color:'#A855F7'}}>End Date</Text></Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.cancelBtnOutline} onPress={() => setCycleStep(0)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveDraftBtn} onPress={handleAddCycle}>
                    <Text style={styles.saveDraftBtnText}>Save Cycle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleDot} />
            <Text style={styles.cardTitle}>Legend</Text>
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIconBase, styles.legendIconPeriod]}><Ionicons name="water" size={18} color="white" /></View>
              <Text style={styles.legendText}>Period Days</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIconBase, styles.legendIconFertile]}><Ionicons name="heart" size={18} color="#6D28D9" /></View>
              <Text style={styles.legendText}>Fertile Window</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIconBase, styles.legendIconPredicted]} />
              <Text style={styles.legendText}>Predicted Period</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIconBase, styles.legendIconToday]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>
        </View>

        {/* AI Summary Report */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleDot} />
            <Text style={styles.cardTitle}>AI Cycle Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}><Text style={styles.summaryLabel}>Predicted Cycle</Text><Text style={styles.summaryValue}>{predictions.averageCycleLength} days</Text></View>
            <View style={styles.summaryBox}><Text style={styles.summaryLabel}>Average Period</Text><Text style={styles.summaryValue}>{predictions.averagePeriodDuration} days</Text></View>
            <View style={styles.summaryBox}><Text style={styles.summaryLabel}>Total Cycles</Text><Text style={styles.summaryValue}>{pastCyclesCount}</Text></View>
            <View style={styles.summaryBox}><Text style={styles.summaryLabel}>Next Period</Text><Text style={styles.summaryValue}>{predictions.nextPeriodDate ? format(parseISO(predictions.nextPeriodDate), 'MMM d') : '-'}</Text></View>
          </View>
        </View>

        {/* Daily Log Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitlePurple}>Daily Log: {format(parseISO(currentDate), 'MMM dd, yyyy')}</Text>
          <View style={styles.tabContainer}>
            {['Flow', 'Symptoms', 'Mood'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Flow' && (
            <View style={styles.flowOptions}>
              {['Light', 'Medium', 'Heavy'].map((flow) => {
                let dropColor = flow === 'Medium' ? '#A855F7' : flow === 'Heavy' ? '#4C1D95' : '#E9D5FF'; 
                return (
                  <TouchableOpacity key={flow} style={[styles.flowCard, selectedFlow === flow && styles.activeCard]} onPress={() => {setSelectedFlow(flow); setIsInsightsVisible(false);}}>
                    <Ionicons name="water" size={32} color={dropColor} />
                    <Text style={[styles.flowText, selectedFlow === flow && styles.activeText]}>{flow}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'Symptoms' && (
            <View style={styles.symptomsGrid}>
              {symptomsList.map((symp) => (
                <TouchableOpacity key={symp.name} style={[styles.symptomPill, selectedSymptoms.includes(symp.name) && styles.activeSymptomPill]} onPress={() => toggleSymptom(symp.name)}>
                  <Image source={symp.image} style={[styles.symptomImage, selectedSymptoms.includes(symp.name) && { opacity: 1, transform: [{scale: 1.1}] }]} />
                  <Text style={[styles.symptomText, selectedSymptoms.includes(symp.name) && styles.activeText]}>{symp.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'Mood' && (
            <View style={styles.moodGrid}>
              {moodsList.map((mood) => (
                <TouchableOpacity key={mood.name} style={[styles.moodCard, selectedMood === mood.name && styles.activeCard]} onPress={() => {setSelectedMood(mood.name); setIsInsightsVisible(false);}}>
                  <Image source={mood.image} style={[styles.moodImage, selectedMood === mood.name && { opacity: 1, transform: [{scale: 1.1}] }]} />
                  <Text style={[styles.moodText, selectedMood === mood.name && styles.activeText]}>{mood.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveDailyLog}>
            <Text style={styles.saveButtonText}>Save Daily Log</Text>
            <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{marginLeft: 8}} />
          </TouchableOpacity>

          {isInsightsVisible && (
            <View style={styles.inlineInsightsWrapper}>
              <View style={[styles.healthBanner, { backgroundColor: healthData().bgColor, borderColor: healthData().borderColor }]}>
                 <Ionicons name={healthData().icon as any} size={32} color={healthData().color} />
                 <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={[styles.healthTitle, { color: healthData().color }]}>{healthData().title}</Text>
                    <Text style={styles.healthMessage}>{healthData().message}</Text>
                 </View>
              </View>

              {selectedSymptoms.length > 0 && (
                <View style={styles.remediesContainer}>
                  <Text style={styles.insightsSubTitle}>🌿 Personalized Remedies</Text>
                  {selectedSymptoms.map((symp) => (
                    <View key={symp} style={styles.inlineRemedyBox}>
                      <View style={styles.remedyIconBox}><Text style={{fontSize: 16}}>✨</Text></View>
                      <View style={{flex: 1}}>
                        <Text style={styles.remedyName}>{symp}</Text>
                        <Text style={styles.remedyDesc}>{remediesData[symp]}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' }, 
  header: { backgroundColor: '#A855F7', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25, borderBottomLeftRadius: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: '#F3E8FF', marginTop: 5 },
  scrollContent: { padding: 20, marginTop: -20 },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  titleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4C1D95' },
  cardTitlePurple: { fontSize: 18, fontWeight: 'bold', color: '#4C1D95', marginBottom: 15 },
  
  dayCellContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconBadge: { position: 'absolute', bottom: -2, right: -4 },

  interactiveLogBox: { marginTop: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 20 },
  logPeriodBtn: { flexDirection: 'row', backgroundColor: '#D946EF', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 25, shadowColor: '#D946EF', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5 },
  logPeriodBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  promptBox: { backgroundColor: '#FAF5FF', padding: 15, borderRadius: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#E9D5FF' },
  promptText: { fontSize: 15, color: '#4B5563', marginBottom: 10, textAlign: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  cancelBtnOutline: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { color: '#6B7280', fontWeight: 'bold', fontSize: 15 },
  saveDraftBtn: { backgroundColor: '#A855F7', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20 },
  saveDraftBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  legendContainer: { marginTop: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  legendIconBase: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  legendIconPeriod: { backgroundColor: '#D946EF' }, 
  legendIconFertile: { backgroundColor: '#F3E8FF' },
  legendIconPredicted: { borderWidth: 1.5, borderColor: '#FBCFE8', borderStyle: 'dashed' },
  legendIconToday: { backgroundColor: '#A855F7', shadowColor: '#A855F7', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5 },
  legendText: { fontSize: 15, color: '#4B5563', fontWeight: '500' },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryBox: { width: '48%', backgroundColor: '#F9F5FF', padding: 15, borderRadius: 16, marginBottom: 15 },
  summaryLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#9333EA' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 30, padding: 5, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25 },
  tabButtonActive: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  tabTextActive: { color: '#4C1D95', fontWeight: 'bold' },
  
  flowOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  flowCard: { width: '31%', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 15, paddingVertical: 15, alignItems: 'center', backgroundColor: 'white' },
  flowText: { fontSize: 13, color: '#4B5563', marginTop: 8, fontWeight: '600' },
  
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  symptomPill: { width: '48%', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 18, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: 'white' },
  symptomImage: { width: 45, height: 45, marginBottom: 10, opacity: 0.8 },
  symptomText: { fontSize: 13, color: '#4B5563', fontWeight: '600', textAlign: 'center' },
  
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodCard: { width: '31%', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 15, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: 'white' },
  moodImage: { width: 42, height: 42, marginBottom: 8, opacity: 0.8 }, 
  moodText: { fontSize: 12, color: '#4B5563', fontWeight: '600', textAlign: 'center' }, 
  
  activeCard: { borderColor: '#A855F7', backgroundColor: '#FAF5FF', borderWidth: 2 },
  activeSymptomPill: { borderColor: '#A855F7', backgroundColor: '#FAF5FF', borderWidth: 2 },
  activeText: { color: '#4C1D95', fontWeight: 'bold' },
  
  saveButton: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#A855F7', borderRadius: 15, paddingVertical: 18, alignItems: 'center', marginTop: 15 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  inlineInsightsWrapper: { marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  healthBanner: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  healthTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  healthMessage: { fontSize: 13, color: '#4B5563', lineHeight: 20 },
  
  remediesContainer: { backgroundColor: '#FAF5FF', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#E9D5FF' },
  insightsSubTitle: { fontSize: 16, fontWeight: '800', color: '#4C1D95', marginBottom: 15 },
  inlineRemedyBox: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  remedyIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FAF5FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  remedyName: { fontSize: 14, fontWeight: 'bold', color: '#4C1D95', marginBottom: 4 },
  remedyDesc: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
});