import { CalculatorScreen } from '@/src/screens/CalculatorScreen';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <CalculatorScreen />
    </View>
  );
}