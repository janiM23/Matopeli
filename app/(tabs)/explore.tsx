import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { fetchScores } from '../api';

export default function TabTwoScreen() {
  const [scores, setScores] = useState<{ id: string; name: string; score: number }[]>([]);

  useEffect(() => {
    async function getScores() {
      try {
        const response = await fetchScores();
        if (response.success) {
          const sortedScores = response.messages ? response.messages.sort((a, b) => b.score - a.score) : []; // Sort scores in descending order
          setScores(sortedScores.slice(0, 5)); // Get top 5 scores
        } else {
          console.error('Failed to fetch scores:', response.error);
        }
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    }

    getScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 Scores</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.scoreText}>{item.name}: {item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scoreText: {
    fontSize: 18,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});