import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Notification එකක් ආවම ෆෝන් එකේ පෙන්වන විදිහ
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false; 

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#A855F7',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    return true;
  }
  return false;
}

export async function schedulePeriodReminder(nextPeriodDate: Date) {
  if (Platform.OS === 'web') return; 

  const triggerDate = new Date(nextPeriodDate);
  triggerDate.setDate(triggerDate.getDate() - 2); 
  triggerDate.setHours(9, 0, 0); 

  await Notifications.cancelAllScheduledNotificationsAsync(); 

  const secondsUntilTrigger = Math.floor((triggerDate.getTime() - new Date().getTime()) / 1000);

  if (secondsUntilTrigger > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌸 Period Reminder",
        body: "Your next period is expected in 2 days. Be prepared and take care! ✨",
        sound: true,
      },
      // 💡 අර දිග කෝඩ් එක වෙනුවට කෙලින්ම වචනෙන් දෙනවා
      trigger: { 
        type: 'timeInterval', 
        seconds: secondsUntilTrigger 
      }, 
    });
  }
}

export async function scheduleOvulationReminder(ovulationDate: Date) {
  if (Platform.OS === 'web') return; 

  const triggerDate = new Date(ovulationDate);
  triggerDate.setDate(triggerDate.getDate() - 1); 
  triggerDate.setHours(10, 0, 0); 

  const secondsUntilTrigger = Math.floor((triggerDate.getTime() - new Date().getTime()) / 1000);

  if (secondsUntilTrigger > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✨ Fertility Window Approaching",
        body: "Your ovulation day is tomorrow. High chances of fertility! 💜",
        sound: true,
      },
      // 💡 කෙලින්ම වචනෙන් දෙනවා
      trigger: { 
        type: 'timeInterval', 
        seconds: secondsUntilTrigger 
      }, 
    });
  }
}

export async function testNotification() {
  if (Platform.OS === 'web') {
    alert("🔔 Notifications work perfectly on Mobile App!");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Successful! 🚀",
      body: "Notifications are perfectly working in your app.",
      sound: true,
    },
    // 💡 බෙල් අයිකන් එකටත් ඒ විදිහටම හැදුවා
    trigger: { 
      type: 'timeInterval', 
      seconds: 5 
    }, 
  });
}