import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Type definition for a chat message
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message from the AI assistant
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm your AI Health Assistant. How are you feeling today? You can tell me about any symptoms or ask questions about your cycle.",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Auto-scroll to the bottom when a new message is added or when the AI is typing
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  // Handle sending message and fetching AI response via Gemini API
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userText = inputText.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // 💡 Your Backend API URL (Ensure this points to your machine's local IP address)
      const API_BASE_URL = Platform.OS === 'web' ? `http://localhost:5000/api` : `http://192.168.8.198:5000/api`; 
      
      // Send user message to the backend to get processed by Gemini AI
      const response = await axios.post(`${API_BASE_URL}/chat`, { message: userText });
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.reply, // The actual response text from the AI!
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.log("Chatbot Error:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please check if the server is running. 😔",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
             <View style={styles.botAvatar}>
                <Ionicons name="medical" size={18} color="#9333EA" />
             </View>
             <View>
                <Text style={styles.headerTitle}>AI Symptom Checker</Text>
                <Text style={styles.headerSubtitle}>Online • Always here to help</Text>
             </View>
          </View>
        </View>
      </LinearGradient>

      {/* Chat Interface Area */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.messageWrapper, msg.sender === 'user' ? styles.messageWrapperUser : styles.messageWrapperBot]}>
              {msg.sender === 'bot' && (
                <View style={styles.smallAvatar}>
                  <Ionicons name="medical" size={12} color="white" />
                </View>
              )}
              
              <View style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.botText]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timeText, msg.sender === 'user' ? styles.userTime : styles.botTime]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {/* AI Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageWrapper, styles.messageWrapperBot]}>
              <View style={styles.smallAvatar}>
                <Ionicons name="medical" size={12} color="white" />
              </View>
              <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#A855F7" />
                <Text style={styles.typingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* User Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your symptoms here..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={inputText.trim() === '' || isTyping}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBackground: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, zIndex: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 15 },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  botAvatar: { width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 12, color: '#E9D5FF', marginTop: 2 },
  
  keyboardAvoid: { flex: 1 },
  chatContent: { padding: 20, paddingBottom: 20 },
  
  messageWrapper: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end', maxWidth: '85%' },
  messageWrapperUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageWrapperBot: { alignSelf: 'flex-start' },
  
  smallAvatar: { width: 24, height: 24, backgroundColor: '#A855F7', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 8, marginBottom: 5 },
  
  messageBubble: { padding: 15, borderRadius: 20 },
  userBubble: { backgroundColor: '#A855F7', borderBottomRightRadius: 5 },
  botBubble: { backgroundColor: 'white', borderBottomLeftRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: 'white' },
  botText: { color: '#1E293B' },
  
  timeText: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  userTime: { color: '#E9D5FF' },
  botTime: { color: '#94A3B8' },

  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 },
  typingText: { fontSize: 13, color: '#A855F7', marginLeft: 8, fontStyle: 'italic' },

  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  textInput: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: '#1E293B', maxHeight: 100, borderWidth: 1, borderColor: '#E2E8F0' },
  sendButton: { width: 45, height: 45, backgroundColor: '#A855F7', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginBottom: 2 },
  sendButtonDisabled: { backgroundColor: '#D8B4FE' },
});