import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>👤 User Profile</Text>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={{ marginTop: 20, color: "red" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
