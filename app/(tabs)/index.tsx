import { CalculatorScreen } from '@/src/screens/CalculatorScreen';
import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      
      {/* 1. The Blog Button (Fixed Size) */}
      <SafeAreaView>
        <Link href="/blog" asChild>
          <TouchableOpacity style={{ 
            backgroundColor: '#007AFF', 
            paddingVertical: 10,
            paddingHorizontal: 24,
            marginTop: 10, 
            marginBottom: 10,
            borderRadius: 30,       // Makes it a "pill" shape
            alignSelf: 'center',    // 👈 This stops it from being full-width
            alignItems: 'center',
            shadowColor: '#000',    // Adds a tiny shadow for polish
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Read Our Blog
            </Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>

      {/* 2. Your Calculator App */}
      <View style={{ flex: 1 }}>
        <CalculatorScreen />
      </View>
      
    </View>
  );
}