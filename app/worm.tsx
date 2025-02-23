import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput} from 'react-native';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import { sendScore, fetchScores } from './api';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const GAME_SIZE = GRID_SIZE * CELL_SIZE;
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Function to fetch scores from the backend
async function handleFetchScores() {
  try {
    await fetchScores();
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
}

export default function WormGame() {
  const [worm, setWorm] = useState([{ x: 10, y: 10 }]); // State to store the worm's position
  const [apple, setApple] = useState({ x: 5, y: 5 }); // State to store the apple's position
  const [direction, setDirection] = useState<Direction>('RIGHT'); // State to store the current direction
  const [lastDirection, setLastDirection] = useState<Direction>('RIGHT'); // State to store the last direction
  const [score, setScore] = useState(0); // State to store the current score
  const [isPopupVisible, setPopupVisible] = useState(false); // State to control the visibility of the popup
  const [playerName, setPlayerName] = useState(''); // State to store the player's name

  // Function to handle player death
  function handlePlayerDeath() {
    setPopupVisible(true); // Show the popup
  }

  // Function to send the score to the backend
  async function handleSendScore() {
    try {
      await sendScore(playerName, score); // Send the current score
      await handleFetchScores(); // Fetch the scores after sending
      setPopupVisible(false); // Hide the popup after sending the score
      resetGame(); // Reset the game state
    } catch (error) {
      console.error('Error sending score:', error);
    }
  }

  // Function to reset the game state
  function resetGame() {
    setWorm([{ x: 10, y: 10 }]);
    setApple({ x: 5, y: 5 });
    setDirection('RIGHT');
    setLastDirection('RIGHT');
    setScore(0);
  }

  // Function to check if the worm collides with itself
  function checkSelfCollision() {
    const head = worm[0];
    for (let i = 1; i < worm.length; i++) {
      if (worm[i].x === head.x && worm[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  // Example game logic to simulate player death
  useEffect(() => {
    // Check for self-collision
    if (checkSelfCollision()) {
      handlePlayerDeath();
    }
  }, [worm]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorm((prev) => {
        const head = { ...prev[0] };
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;

        head.x = (head.x + GRID_SIZE) % GRID_SIZE;
        head.y = (head.y + GRID_SIZE) % GRID_SIZE;

        //prev.some(segment => segment.x === head.x && segment.y === head.y)
        if (checkSelfCollision()) {
          handlePlayerDeath(); // Handle player death on collision
          return prev; // Do not reset the worm state here
        }

        const newWorm = [head, ...prev.slice(0, -1)];
        if (head.x === apple.x && head.y === apple.y) {
          setApple({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          setScore(prevScore => prevScore + 5); // Update the score
          newWorm.push(prev[prev.length - 1]);
        }

        setLastDirection(direction);
        return newWorm;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [direction, apple]);

  // Function to handle swipe gestures
  const handleSwipe = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state !== State.END) return; // Process only when gesture ends
    const { translationX, translationY } = event.nativeEvent;
    let newDirection = direction;
    
    if (Math.abs(translationX) > Math.abs(translationY)) {
      newDirection = translationX > 0 ? 'RIGHT' : 'LEFT';
    } else {
      newDirection = translationY > 0 ? 'DOWN' : 'UP';
    }
  
    if (
      newDirection !== lastDirection &&
      !(
        (newDirection === 'UP' && lastDirection === 'DOWN') ||
        (newDirection === 'DOWN' && lastDirection === 'UP') ||
        (newDirection === 'LEFT' && lastDirection === 'RIGHT') ||
        (newDirection === 'RIGHT' && lastDirection === 'LEFT')
      )
    ) {
      setDirection(newDirection);
      setLastDirection(newDirection);
    }
  };

  return (
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <View style={styles.container}>
          <Text style={styles.score}>Score: {score}</Text>
          <View style={styles.grid}>
            <View
              style={{
                position: 'absolute',
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: 'red',
                left: apple.x * CELL_SIZE,
                top: apple.y * CELL_SIZE,
              }}
            />
            {worm.map((segment, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: 'green',
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                }}
              />
            ))}
          </View>
          {isPopupVisible && (
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Game Over</Text>
              <Text>Your score: {score}</Text> {/* Display the current score */}
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={playerName}
                onChangeText={setPlayerName}
              />
              <Button title="Send Score" onPress={handleSendScore} />
              <Button title="Cancel" onPress={() => {
                setPopupVisible(false);
                resetGame(); // Reset the game state when the popup is closed
              }} />
            </View>
          )}
        </View>
      </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Set the background color of the entire container to black
  },
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'white',
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 1000,
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  grid: {
    width: GAME_SIZE,
    height: GAME_SIZE,
    borderColor: '#ccc',
    borderWidth: 2,
    backgroundColor: 'black', // Set the background color of the grid to black
  },
});