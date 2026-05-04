import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  
  // States
  const [fullName, setFullName] = useState('Loading...');
  const [userName, setUserName] = useState('user');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      
      const savedName = await AsyncStorage.getItem("name");
      const savedUser = await AsyncStorage.getItem("userName"); 
      const savedPic = await AsyncStorage.getItem("profilePic");

      if (savedName) setFullName(savedName);
      if (savedUser) setUserName(savedUser);
      if (savedPic) setProfilePic(savedPic);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const pickImage = async () => {
    
    if (Platform.OS === 'web') {
      openLibrary();
      return;
    }

    Alert.alert(
      "Profile Picture",
      "Choose a photo source",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openLibrary },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) saveImage(result.assets[0].uri);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) saveImage(result.assets[0].uri);
  };

  const saveImage = async (uri: string) => {
    setProfilePic(uri);
    await AsyncStorage.setItem("profilePic", uri);
  };

  const handleLogout = async () => {
    const logoutAction = async () => {
      await AsyncStorage.clear();
      router.replace("/login");
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Logout?")) logoutAction();
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel" },
        { text: "Logout", style: "destructive", onPress: logoutAction }
      ]);
    }
  };

  // Common UI row for Settings
  const SettingItem = ({ icon, title, subtitle, color, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      
      {/* 1. Welcoming with Full Name */}
      <View style={styles.headerSection}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.nameText}>{fullName}!</Text>
      </View>

      {/* 2. User Info Card */}
      <View style={styles.userCard}>
        <TouchableOpacity onPress={pickImage}>
          <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.avatarGradient}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>{fullName.charAt(0).toUpperCase()}</Text>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={styles.fullNameText}>{fullName}</Text>
          <Text style={styles.usernameTag}>@{userName}</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/editProfile" as any)}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Navigation Links added to SettingItems */}
      <Text style={styles.sectionTitle}>Personal & Security</Text>
      <View style={styles.groupCard}>
        <SettingItem 
          icon="person-outline" 
          title="Edit Profile" 
          subtitle="Change name, bio, and personal details" 
          color="#7c3aed" 
          onPress={() => router.push("/editProfile" as any)} // 👈 Navigation path
        />
        <View style={styles.separator} />
        <SettingItem 
          icon="shield-checkmark-outline" 
          title="Account Security" 
          subtitle="Manage passwords" 
          color="#4CAF50" 
          onPress={() => router.push("/security" as any)}
        />
      </View>

      <Text style={styles.sectionTitle}>App Settings</Text>
      <View style={styles.groupCard}>
        <SettingItem 
          icon="notifications-outline" 
          title="Notifications" 
          subtitle="Alerts and reminders" 
          color="#FF9800" 
          onPress={() => router.push("/notifications" as any)}
        />
        <View style={styles.separator} />
        <SettingItem 
          icon="color-palette-outline" 
          title="App Theme" 
          subtitle="Light and Dark mode" 
          color="#2196F3" 
          onPress={() => Alert.alert("Theme", "Coming soon!")}
        />
      </View>

      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.groupCard}>
        <SettingItem icon="help-circle-outline" title="Help & Support" color="#607D8B" onPress={() => router.push("/help" as any)} />
        <View style={styles.separator} />
        <SettingItem icon="document-text-outline" title="Privacy Policy" color="#607D8B" onPress={() => router.push("/privacy" as any)} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ff4d4d" />
        <Text style={styles.logoutText}>Logout from Account</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerSection: { paddingTop: 60, paddingHorizontal: 25, marginBottom: 20 },
  welcomeText: { fontSize: 18, color: '#6b7280' },
  nameText: { fontSize: 28, fontWeight: 'bold', color: '#7c3aed' },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 25, elevation: 4, marginBottom: 25 },
  avatarGradient: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  profileImage: { width: 70, height: 70 },
  avatarText: { fontSize: 28, color: 'white', fontWeight: 'bold' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#333', padding: 4, borderRadius: 10, borderWidth: 2, borderColor: 'white' },
  userInfo: { flex: 1, marginLeft: 15 },
  fullNameText: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  usernameTag: { fontSize: 14, color: '#9ca3af' },
  editBtn: { backgroundColor: '#f3e8ff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15 },
  editBtnText: { color: '#7c3aed', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#6b7280', marginLeft: 25, marginBottom: 10 },
  groupCard: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 20, marginBottom: 20, elevation: 2 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingTextContainer: { flex: 1, marginLeft: 15 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  settingSubtitle: { fontSize: 12, color: '#9ca3af' },
  separator: { height: 1, backgroundColor: '#f3f4f6', marginLeft: 70 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15 },
  logoutText: { color: '#ff4d4d', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});