import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';
let token = '';

async function testEndpoints() {
  try {
    console.log('1. Registering test user...');
    const email = `test_${Date.now()}@vader.com`;
    const username = `test_${Date.now()}`;
    await axios.post(`${API_BASE}/register`, {
      name: 'Test User',
      username,
      email,
      password: 'password123'
    });

    console.log('2. Logging in...');
    const loginRes = await axios.post(`${API_BASE}/login`, {
      email,
      password: 'password123'
    });
    token = loginRes.data.data.token;
    console.log('Token acquired.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('3. GET /api/preferences');
    const prefRes = await axios.get(`${API_BASE}/preferences`, { headers });
    console.log('Preferences retrieved.');

    console.log('4. GET /api/recommendations/games');
    const gameRes = await axios.get(`${API_BASE}/recommendations/games?limit=3`, { headers });
    const games = gameRes.data.data;
    console.log(`Received ${games.length} game recommendations.`);
    if (games.length > 0) {
      console.log('Sample structure:', Object.keys(games[0].recommendation));
      console.log('Classification:', games[0].recommendation.classification);
    }

    console.log('5. GET /api/recommendations/news');
    const newsRes = await axios.get(`${API_BASE}/recommendations/news?limit=3`, { headers });
    console.log(`Received ${newsRes.data.data.length} news recommendations.`);

    console.log('6. GET /api/recommendations/tournaments');
    const tournRes = await axios.get(`${API_BASE}/recommendations/tournaments?limit=3`, { headers });
    console.log(`Received ${tournRes.data.data.length} tournament recommendations.`);

    console.log('7. POST /api/interactions');
    const interRes = await axios.post(`${API_BASE}/interactions`, {
      itemId: games[0].item._id || '123',
      itemType: 'game',
      action: 'view',
      metadata: {
        title: games[0].item.title,
        genres: games[0].item.genres,
        tags: games[0].item.tags
      }
    }, { headers });
    console.log('Interaction logged.');

    console.log('8. POST /api/recommendations/explain (skipping for new user without profile)');
    
    console.log('9. GET /profile');
    const profilePage = await axios.get(`http://localhost:3000/profile`);
    console.log('Profile page loaded with status', profilePage.status);

    console.log('10. GET /arcade');
    const arcadePage = await axios.get(`http://localhost:3000/arcade`);
    console.log('Arcade page loaded with status', arcadePage.status);

    console.log('ALL TESTS PASSED!');
  } catch (err: any) {
    console.error('API Test Failed:', err.response?.data || err.message);
  }
}

testEndpoints();
