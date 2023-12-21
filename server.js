const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
// const cors = require('cors');
// Connect Database
connectDB();
// Replace if using a different env file or config
const env = require('dotenv').config({ path: './.env' });

app.use(express.static(process.env.STATIC_DIR));

app.use(express.static(process.env.STATIC_DIR));
// Init Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/subscribe', require('./routes/api/subscription'));
app.use('/api/article', require('./routes/api/article'));
app.use('/api/persona', require('./routes/api/persona'));
// const options = {
//   origin: 'http://localhost:5000'
// };
// app.use(cors(options));
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
