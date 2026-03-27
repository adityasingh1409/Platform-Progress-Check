import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'aditya_test_' + Date.now(),
        email: 'test_' + Date.now() + '@example.com',
        password: 'password123'
    });
    console.log('Register success:', res.data);
  } catch (err) {
    console.error('Register failed:', err.response ? err.response.data : err.message);
  }
}

test();
