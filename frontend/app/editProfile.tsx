import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfile() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = Platform.OS === 'web' 
      ? `http://localhost:5000/api` 
      : `http://192.168.8.198:5000/api`; 

  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const savedName = await AsyncStorage.getItem("name");
      const savedUser = await AsyncStorage.getItem("userName");
      const savedEmail = await AsyncStorage.getItem("userEmail"); 
      const savedPic = await AsyncStorage.getItem("profilePic");

      if (savedName) setName(savedName);
      if (savedUser) setUsername(savedUser);
      if (savedEmail) setEmail(savedEmail);
      if (savedPic) setProfilePic(savedPic);
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!name || !username) {
      Alert.alert("Error", "Name and Username are required.");
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      
      // 1. Update Backend
      await axios.post(`${API_BASE_URL}/users/updateProfile`, {
        userId,
        name,
        username,
        email,
        profilePic 
      });

      // 2. Update Local Storage
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("userName", username);
      if (email) await AsyncStorage.setItem("userEmail", email);
      if (profilePic) await AsyncStorage.setItem("profilePic", profilePic);
      
      Alert.alert("Success", "Profile updated successfully!");
      
     
     router.replace("/(tabs)/Profile");

    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/Profile")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage}>
            <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.avatarGradient}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.profileImage} />
              ) : (
                <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
              )}
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={18} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.changeText}>Tap to change photo</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your Name" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="username" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="example@mail.com" keyboardType="email-address" />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
            <Text style={styles.saveBtnText}>{loading ? "Saving..." : "Save All Changes"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  backButton: { padding: 5 },
  imageSection: { alignItems: 'center', marginBottom: 30 },
  avatarGradient: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  profileImage: { width: 110, height: 110 },
  avatarText: { fontSize: 40, color: 'white', fontWeight: 'bold' },
  cameraOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: 4, alignItems: 'center' },
  changeText: { marginTop: 10, color: '#7c3aed', fontWeight: '500' },
  form: { marginTop: 10 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  saveBtn: { backgroundColor: '#7c3aed', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});