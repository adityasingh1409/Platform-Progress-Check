import axios from 'axios';

async function testUpdate() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
    }).catch(async (e) => {
        // Register if not exist
        await axios.post('http://localhost:5000/api/auth/register', {
            username: 'testuser1234',
            email: 'test@example.com',
            password: 'password123'
        });
        return axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
    });

    const token = loginRes.data.token;
    console.log('Got token:', !!token);

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

testUpdate();
