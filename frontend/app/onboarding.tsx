import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.title}>Period Tracker</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Track your cycle, understand your body{"\n"}
        & predict your next period 🌸
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f5e1ff", // light purple background
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#7c3aed", // deep purple
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#ec4899", // pink
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
