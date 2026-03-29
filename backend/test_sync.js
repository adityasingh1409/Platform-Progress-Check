import axios from 'axios';

async function fullTest() {
  try {
    let token;
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testsync2@example.com',
            password: 'password'
        });
        token = loginRes.data.token;
    } catch(err) {
        await axios.post('http://localhost:5000/api/auth/register', {
            username: 'sync_test_user2',
            email: 'testsync2@example.com',
            password: 'password'
        });
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testsync2@example.com',
            password: 'password'
        });
        token = loginRes.data.token;
    }

    console.log('Got token:', !!token);

    const updateRes = await axios.put('http://localhost:5000/api/auth/platforms', {
        leetcode: 'https://leetcode.com/u/vMIAtisXid'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update success:', updateRes.data);

    // Call sync endpoint
    const syncRes = await axios.post('http://localhost:5000/api/stats/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Sync success:', syncRes.data);

  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
  }
}

fullTest();
