import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ArticleViewScreen() {
  const router = useRouter();
  
  // Consult පේජ් එකෙන් එවන ලිපියේ විස්තර (ID, Title, Read Time) මෙතනින් ගන්නවා
  const { id, title, readTime } = useLocalSearchParams();

  // දැනට අපි ලිපි 3ක් තියෙන නිසා, ඒවට අදාළ සම්පූර්ණ විස්තර සහ පින්තූර මෙතන හදලා තියෙනවා.
  // ඉස්සරහට මේවා Database එකෙන් එන විදිහට හදන්න පුළුවන්.
  const articleContent: Record<string, any> = {
    '1': {
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop', // යෝගා කරන පින්තූරයක්
      author: 'Dr. Sarah Jenkins',
      date: 'April 20, 2026',
      content: `Experiencing cramps during your period is a common issue for many women, but it doesn't mean you have to suffer in silence. These cramps, also known as dysmenorrhea, are caused by the uterus contracting to shed its lining.\n\nHere are some natural, effective ways to manage and reduce period pain:\n\n1. Apply Heat Therapy\nUsing a heating pad or a hot water bottle on your lower abdomen or lower back can significantly reduce muscle tension and relax the contracting muscles in your uterus.\n\n2. Stay Hydrated\nIt might sound counterintuitive, but drinking more water can actually reduce water retention and bloating, which often makes cramps feel worse. Try warm water or herbal teas like chamomile.\n\n3. Light Exercise\nWhile you might feel like curling up in bed, light exercises like yoga, stretching, or a short walk can increase blood flow and release endorphins, your body's natural painkillers.\n\n4. Dietary Adjustments\nIn the days leading up to your period, try to reduce your intake of salty foods, caffeine, and alcohol. Instead, focus on anti-inflammatory foods like berries, tomatoes, and leafy greens.\n\nIf your cramps are severe, accompanied by nausea, or disrupt your daily life, it's always best to consult with a healthcare professional.`
    },
    '2': {
      image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=1000&auto=format&fit=crop', // කැලැන්ඩර්/මල් පින්තූරයක්
      author: 'Dr. Emily Carter',
      date: 'April 22, 2026',
      content: `Understanding your fertile window is crucial, whether you are trying to conceive or simply want to learn more about your body's natural rhythms.\n\nWhat is the Fertile Window?\nThe fertile window refers to the specific days in a woman's menstrual cycle when pregnancy is possible. It typically spans a period of about six days: the five days leading up to ovulation and the day of ovulation itself.\n\nKey Signs of Ovulation:\n• Changes in Cervical Mucus: As you approach ovulation, your cervical mucus becomes clear, stretchy, and slippery, resembling raw egg whites.\n• Basal Body Temperature: Your resting body temperature slightly increases after ovulation occurs.\n• Mild Pelvic Pain: Some women experience a slight twinge or cramp on one side of their lower abdomen, known as mittelschmerz.\n\nTracking your cycle regularly using this app will help you pinpoint your unique fertile window more accurately over time.`
    },
    '3': {
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop', // සෞඛ්‍ය සම්පන්න කෑම පින්තූරයක්
      author: 'Nutritionist Anna Silva',
      date: 'April 25, 2026',
      content: `What you eat can have a profound impact on how you feel throughout your menstrual cycle. Adapting your diet to the different phases of your cycle can help manage symptoms like fatigue, bloating, and mood swings.\n\nMenstrual Phase (Days 1-5):\nDuring your period, your iron levels drop due to blood loss. Focus on iron-rich foods like spinach, lentils, and lean meats. Pair them with Vitamin C (like oranges or bell peppers) to boost absorption.\n\nFollicular Phase (Days 6-14):\nAs estrogen levels rise, focus on fresh, light, and vibrant foods. Incorporate plenty of fresh salads, fermented foods like yogurt or kimchi, and lean proteins to support your energy levels.\n\nOvulatory Phase (Days 15-17):\nYour energy is peaking! Support this phase with anti-inflammatory foods. Berries, nuts, seeds, and omega-3 rich fish like salmon are excellent choices.\n\nLuteal Phase (Days 18-28):\nThis is when PMS symptoms might appear. Complex carbohydrates like sweet potatoes and quinoa can help stabilize blood sugar and mood. Magnesium-rich foods, such as dark chocolate and pumpkin seeds, can help alleviate cramps and fatigue.`
    }
  };

  // අදාළ ID එකට තියෙන විස්තර ගන්නවා, නැත්නම් Default එකක් පෙන්වනවා
  const currentArticle = articleContent[id as string] || articleContent['1'];

  return (
    <View style={styles.container}>
      {/* 💡 Header එක පින්තූරයක් උඩින් පේන විදිහට හදලා තියෙන්නේ */}
      <View style={styles.imageHeaderContainer}>
        <Image 
          source={{ uri: currentArticle.image }} 
          style={styles.headerImage} 
        />
        <LinearGradient 
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.imageOverlay}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Article Title & Info */}
        <View style={styles.titleSection}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>Health Tips</Text>
          </View>
          <Text style={styles.articleTitle}>{title || "Health Article"}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="person-circle-outline" size={16} color="#64748B" />
              <Text style={styles.metaText}>{currentArticle.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{currentArticle.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{readTime || "5 min read"}</Text>
            </View>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.contentSection}>
          <Text style={styles.bodyText}>
            {currentArticle.content}
          </Text>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={20} color="#A855F7" />
          <Text style={styles.shareButtonText}>Share this article</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  imageHeaderContainer: { height: 280, width: '100%' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },
  bookmarkButton: { width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { flex: 1, marginTop: -30, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 25, paddingTop: 30 },
  
  titleSection: { marginBottom: 25 },
  tagBadge: { alignSelf: 'flex-start', backgroundColor: '#F3E8FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 15 },
  tagText: { color: '#9333EA', fontSize: 12, fontWeight: 'bold' },
  articleTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', lineHeight: 32, marginBottom: 15 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 },
  metaText: { fontSize: 12, color: '#64748B', marginLeft: 5 },

  contentSection: { marginBottom: 30 },
  bodyText: { fontSize: 16, color: '#334155', lineHeight: 28 }, // Line height වැඩි කරලා තියෙන්නේ කියවන්න ලේසි වෙන්න

  shareButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingVertical: 15, borderRadius: 15, borderWidth: 1, borderColor: '#F1F5F9' },
  shareButtonText: { fontSize: 15, fontWeight: 'bold', color: '#A855F7', marginLeft: 10 },
});