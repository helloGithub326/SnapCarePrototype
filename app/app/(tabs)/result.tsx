import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Key } from 'react';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let dataString = params.data;

  if (Array.isArray(dataString)) {
    dataString = dataString[0];
  }

  let parsedData = null;
  try {
    parsedData = dataString ? JSON.parse(dataString) : null;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
  }
  console.log(parsedData)
  
  var disease1 = parsedData.results[0][0];
  var disease2 = parsedData.results[1][0];
  var disease3 = parsedData.results[2][0];
  var desc1 = parsedData.results[0][2]["description"];
  var desc2 = parsedData.results[1][2]["description"];
  var desc3 = parsedData.results[2][2]["description"];
  var tips1 = parsedData.results[0][2]["tips"];
  var tips2 = parsedData.results[1][2]["tips"];
  var tips3 = parsedData.results[2][2]["tips"];

  return (
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Result</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">You have either {disease1}, {disease2}, or {disease3}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">{disease1}</ThemedText>
          <ThemedText>
            {desc1}
          </ThemedText>
          <ThemedText>
            {tips1.map((tip: any, index: Key | null | undefined) => (
              <ThemedText key={index}>{`- ${tip}\n`}</ThemedText>
            ))}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">{disease2}</ThemedText>
          <ThemedText>
            {desc2}
          </ThemedText>
          <ThemedText>
            {tips2.map((tip: any, index: Key | null | undefined) => (
              <ThemedText key={index}>{`- ${tip}\n`}</ThemedText>
            ))}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">{disease2}</ThemedText>
          <ThemedText>
            {desc2}
          </ThemedText>
          <ThemedText>
            {tips2.map((tip: any, index: Key | null | undefined) => (
              <ThemedText key={index}>{`- ${tip}\n`}</ThemedText>
            ))}
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      <ThemedView style={styles.disclaimerContainer}>
          <ThemedText>
            <ThemedText type="link">Disclaimer: This app's analysis is not completely accurate and is not a substitute for professional medical advice.</ThemedText>
          </ThemedText>
        </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  disclaimerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactLogo: {
    height: 89,
    width: 145,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
