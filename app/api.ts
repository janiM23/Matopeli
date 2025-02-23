// This file contains the API functions for sending and fetching scores.
const API_URL = 'https://firebaseserveri-kt0it9089-janimaki-seamkfis-projects.vercel.app';

export async function sendScore(name: string, score: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, score }),
    });

    const rawData = await response.text(); // Read the raw response
    console.log('Raw response:', rawData); // Log the raw response

    if (rawData.startsWith('<!DOCTYPE html>')) {
      console.error('Received HTML response instead of JSON. Please check the API URL and backend configuration.');
      return;
    }

    try {
      const data = JSON.parse(rawData); // Attempt to parse the JSON
      if (data.success) {
        console.log(`Score sent successfully: ${data.name} - ${data.score}`);
      } else {
        console.error(`Failed to send score: ${data.error}`);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response was:', rawData);
    }
  } catch (error) {
    console.error('Error sending score:', error);
  }
}

export async function fetchScores(): Promise<{ success: boolean; messages?: any[]; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const rawData = await response.text(); // Read the raw response
    console.log('Raw response:', rawData); // Log the raw response

    const data = JSON.parse(rawData); // Attempt to parse the JSON
    if (data.success) {
      console.log('Fetched scores:', data.messages);
      return { success: true, messages: data.messages };
    } else {
      console.error('Failed to fetch scores:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: String(error) };
    }
  }
}