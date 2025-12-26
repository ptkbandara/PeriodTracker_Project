import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Calendar, DateData } from "react-native-calendars"; // ✅ DateData import කළා
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  
  // ✅ දවස් Mark කරගන්න State එක (Type එක 'any' කළා)
  // දැන් TypeScript දන්නවා මේක ඇතුලට ඕන දෙයක් දාන්න පුළුවන් කියලා.
  const [markedDates, setMarkedDates] = useState<any>({});

  // ✅ දවසක් Click කළාම වෙන දේ
  // 'day' එකට 'DateData' කියන Type එක දුන්නා
  const onDayPress = (day: DateData) => {
    const dateString = day.dateString;
    
    // දැනටමත් select කරලද බලනවා
    const isSelected = markedDates[dateString];

    const newMarkedDates = { ...markedDates };

    if (isSelected) {
      // තිබ්බ එක අයින් කරනවා
      delete newMarkedDates[dateString];
    } else {
      // අලුතෙන් add කරනවා 
      newMarkedDates[dateString] = {
        selected: true,
        selectedColor: "#ec4899", 
        marked: true,
      };
    }

    setMarkedDates(newMarkedDates);
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.subGreeting}>Track your cycle easily.</Text>
      </View>

      {/* ✅ CALENDAR COMPONENT */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#ec4899',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#ec4899',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#ec4899',
            monthTextColor: '#7c3aed',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
          
          style={styles.calendar}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Cycle Summary</Text>
        <Text style={styles.infoText}>Tap on a date to mark your period start or end.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e1ff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  subGreeting: {
    fontSize: 16,
    color: "#6b7280",
  },
  calendarContainer: {
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 15,
    paddingBottom: 10,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  infoText: {
    color: '#6b7280',
    lineHeight: 20,
  }
});