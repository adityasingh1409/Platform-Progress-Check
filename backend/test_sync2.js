import axios from 'axios';

async function verifySync() {
  try {
    let token;
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testsync2@example.com',
            password: 'password'
        });
        token = loginRes.data.token;
    } catch(err) {
        console.log("Could not log in testsync2. Did the db wipe?");
        return;
    }

    const updateRes = await axios.put('http://localhost:5000/api/auth/platforms', {
        leetcode: 'https://leetcode.com/u/vMIAtisXid/'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update success:', updateRes.data);

    const syncRes = await axios.post('http://localhost:5000/api/stats/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Sync success:', syncRes.data);
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
  }
}

verifySync();
