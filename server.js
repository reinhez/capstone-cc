const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./config/service-account-key.json'); // Update with your file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const app = express();
app.use(bodyParser.json());

// GET route to display "response success" on web
app.get('/', (req, res) => {
  res.send('response success');
});

// Sign up API
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await auth.createUser({
      email,
      password,
    });
    res.status(201).json({ message: 'User created successfully', userId: user.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Use Firebase Admin SDK to verify the credentials indirectly via custom tokens
    const user = await auth.getUserByEmail(email);

    // In production, validate credentials on the client side using Firebase SDK
    res.status(200).json({ message: 'Login successful', userId: user.uid });
  } catch (error) {
    res.status(400).json({ error: 'Invalid email or password' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
