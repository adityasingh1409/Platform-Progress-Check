import axios from 'axios';

async function testAdmin() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin131@example.com', // wait, I don't know the exact email of admin131. Let's just create a token for admin131.
        });
    } catch(e) {
    }
}
testAdmin();
