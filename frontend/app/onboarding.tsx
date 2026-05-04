import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Onboarding() {
  const router = useRouter();

  return (
    <LinearGradient
      
      colors={['#4C1D95', '#7C3AED', '#A855F7']} 
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        
        
        <View style={styles.imageWrapper}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
        
        {/* App Name */}
        <Text style={styles.title}>Girl's Period Tracker</Text>
        
        {/* පොඩි Subtitle එකක් */}
        <Text style={styles.subtitle}>Understand your body, beautifully.</Text>
      </View>

      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
        activeOpacity={0.9}
      >
        <Text style={styles.btnText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="#7C3AED" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  
  imageWrapper: {
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15, 
  },
  

  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 40, 
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)', 
  },

  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#E9D5FF",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 30,
    width: '80%',
  },
  btnText: {
    color: "#7C3AED",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});