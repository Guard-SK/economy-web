import axios from 'axios';

export async function recalculate() {
  try {
    const response = await axios.post(
      'https://us-central1-vuefirebaseauth-35637.cloudfunctions.net/recalculate'
    );
    console.log(response.data); // Assuming the function returns a message
  } catch (error) {
    console.error('Error triggering function:', error);
  }
}