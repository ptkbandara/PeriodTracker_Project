import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 1. Fixed: Added missing required properties for NotificationBehavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // Required by TS
    shouldShowList: true,   // Required by TS
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
      alert('Failed to get push token for push notification!');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
}

export async function schedulePeriodReminder(nextPeriodDate: Date) {
  if (Platform.OS === 'web') return;

  const triggerDate = new Date(nextPeriodDate);
  triggerDate.setDate(triggerDate.getDate() - 2);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌸 Period Reminder",
      body: "Your next period is expected in 2 days. Be prepared and take care! ✨",
      sound: true,
      // 2. Fixed: Removed the 'android' object from here as it's often invalid in ContentInput types
    },
    // 3. Fixed: Wrapped Date in the correct trigger format
    trigger: {
      date: triggerDate,
    } as Notifications.DateTriggerInput, 
  });
}

export async function scheduleOvulationReminder(ovulationDate: Date) {
  if (Platform.OS === 'web') return;

  const triggerDate = new Date(ovulationDate);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(10, 0, 0, 0);

  if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✨ Fertility Window Approaching",
      body: "Your ovulation day is tomorrow. High chances of fertility! 💜",
      sound: true,
    },
    // 3. Fixed: Wrapped Date in the correct trigger format
    trigger: {
      date: triggerDate,
    } as Notifications.DateTriggerInput,
  });
}

export async function testNotification() {
  if (Platform.OS === 'web') {
    alert("🔔 Notifications work perfectly on Mobile App!");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Successful! 🚀",
      body: "Notifications are working perfectly.",
      sound: true,
    },
    // 4. Fixed: Added required 'type' for timeInterval
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}