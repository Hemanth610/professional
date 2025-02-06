const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const MONGODB_URI = 'mongodb+srv://hemanthtempalli8:sTNKOzIFyUOeUgLy@cluster.wf0vf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your Vite frontend runs on
  credentials: true
}));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();
