import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = Platform.OS === 'web' 
   ? `http://localhost:5000/api` 
   : `http://192.168.8.198:5000/api`;

  const handleRegister = async () => {
    if (!name || !username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

   try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }), 
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully! Please Login.");
        router.replace("/login");
      } else {
        Alert.alert("Registration Failed", data.message);
      }
    } catch (err) {
      Alert.alert("Connection Error", "Cannot connect to server. Check your internet or IP.");
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
          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>
            Track your cycle with confidence 💗
          </Text>
        </View>

        <View style={styles.form}>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9333EA" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Username */}
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

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#9333EA" />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
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

          {/* REGISTER BUTTON */}
          <TouchableOpacity onPress={handleRegister} style={styles.buttonContainer}>
            <LinearGradient
              colors={['#A855F7', '#9333EA']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Login</Text>
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
    fontSize: 30,
    fontWeight: '800',
    color: '#9333EA', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
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
  loginText: {
    color: '#9333EA', 
    fontSize: 15,
    fontWeight: 'bold',
  },
});