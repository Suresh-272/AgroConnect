require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGO_URL;

const app = express();
// Create HTTP server
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

// Routes
const authRoutes = require('./router/AuthRouter');
const userRoutes = require('./router/UserRoutes');
const paymentRouter = require('./router/paymentRouter');


// API Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRouter);


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});