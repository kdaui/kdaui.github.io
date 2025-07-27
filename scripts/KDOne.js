const audio = document.getElementById('lofi-audio');
const serverTimeUrl = 'https://worldtimeapi.org/api/timezone/Etc/UTC';

async function syncAudio() {
  try {
    const response = await fetch(serverTimeUrl);
    const data = await response.json();
    const serverTime = new Date(data.utc_datetime).getTime();
    const streamStartTime = new Date('2024-06-23T00:00:00Z').getTime();
    const currentStreamTime = (serverTime - streamStartTime) / 1000;

    audio.currentTime = currentStreamTime;
    audio.play();
  } catch (error) {
    console.error('Error syncing audio:', error);
  }
}

syncAudio();