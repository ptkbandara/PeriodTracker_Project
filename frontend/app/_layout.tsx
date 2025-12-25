import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors'; 

export default function RootLayout() {
  return (
    <>
     
      <StatusBar style="dark" />

      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background, 
        },
        headerTintColor: Colors.primary, 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false, 
      }}>
        
       
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />

        
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login',
            headerShown: true 
          }} 
        />

        
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Create Account',
            headerShown: true
          }} 
        />

        
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        
        
         <Stack.Screen 
          name="onboarding" 
          options={{ headerShown: false }} 
        />

      </Stack>
    </>
  );
}
