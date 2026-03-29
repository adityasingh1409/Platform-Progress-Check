import axios from 'axios';

async function testOldUser() {
  try {
    // Attempt Login
    let token;
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'you@example.com', // Let's guess the user's email or register another new one to test if the problem is generalized or user-specific.
            password: 'password'
        });
        token = loginRes.data.token;
    } catch(err) {
        // Just create a brand new user but manually push gfg/hackerrank into mongo to simulate the problem
        console.log('Login failed for dummy old user, proceeding with user isolation...');
        return;
    }

    if (!token) return;

    const updateRes = await axios.put('http://localhost:5000/api/auth/platforms', {
        leetcode: 'https://leetcode.com/u/aditya/'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update success:', updateRes.data);
  } catch (err) {
    console.error('Update failed:', err.response?.data || err.message);
  }
}

testOldUser();
