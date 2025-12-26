import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";   // ✅ IMPORT
import Ionicons from "@expo/vector-icons/build/Ionicons";



export default function Login() {
  const router = useRouter();

  // ✅ STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://192.168.8.198:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace("/(tabs)/Home");
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>


       
      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={email}                 // ✅ CONNECT STATE
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password */}
      
      <View style={styles.passwordContainer}>
      <TextInput
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry={!showPassword}
        style={styles.passwordInput}
        value={password}              // ✅ CONNECT STATE
        onChangeText={setPassword} />
        
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons 
            name={showPassword ? "eye" : "eye-off"} // Icon එක මාරු වෙනවා
            size={24} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
    </View>

    {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}          // ✅ CALL BACKEND
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      {/* Register link */}
      <TouchableOpacity onPress={() => router.push("/Register")}>
        <Text style={styles.link}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#f5e1ff",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#7c3aed",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 35,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  
   passwordContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16, 
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  
  passwordInput: {
    flex: 1, 
    paddingVertical: 14,
    fontSize: 15,
  },
  
  button: {
    backgroundColor: "#ec4899",
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },


  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    marginTop: 22,
    color: "#9333ea",
    fontWeight: "600",
  },
});
