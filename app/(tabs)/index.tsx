import { Image, StyleSheet, View, Button} from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Wrap everything here */}
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome! </ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Play the Worm Game</ThemedText>
          <View style={styles.buttonContainer}>
            <Button title="Start Game" onPress={() => router.push('/worm')} />
          </View>
          <ThemedText type="default">Use arrow keys to control the worm. Press Enter to start the game!</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});