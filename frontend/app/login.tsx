import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = Platform.OS === 'web' 
   ? `http://localhost:5000/api` 
   : `http://192.168.8.198:5000/api`;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username,
        password: password
      });

      if (response.data.user) {
        const user = response.data.user;

        try {
          await AsyncStorage.clear(); 
        } catch (storageError) {
          console.log("Storage clear ignored (Normal on first run):", storageError);
        }
        
        await AsyncStorage.setItem("userId", user.id);
        await AsyncStorage.setItem("userName", user.username);
        
        if (user.name) {
          await AsyncStorage.setItem("name", user.name); 
        }

        Alert.alert("Success", "Logged in successfully!");
        router.replace("/Home"); 
      }
    } catch (error) {
      console.log("Login Error:", error);
      Alert.alert("Error", "Invalid Username or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to track your cycle seamlessly.</Text>
        </View>

        <View style={styles.form}>
          
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={20} color="#9333EA" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input with Eye Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#9333EA" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"} 
                size={22} 
                color="#9ca3af" 
              />
            </TouchableOpacity>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity onPress={handleLogin} style={styles.buttonContainer} disabled={loading}>
            <LinearGradient
              colors={['#A855F7', '#9333EA']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/Register")}>
              <Text style={styles.registerText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E8FF', // NEW: Soft beautiful light purple background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#9333EA', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Clean white
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 18,
    height: 56,
    // NEW: 3D Shadow effect instead of a flat border
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#1E293B',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 15,
  },
  registerText: {
    color: '#9333EA',
    fontSize: 15,
    fontWeight: 'bold',
  },
});