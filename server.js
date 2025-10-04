const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const clientRoutes = require('./routes/clients');
const caseRoutes = require('./routes/cases');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/cases', caseRoutes);

// Statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Client = require('./models/Client');
    const Case = require('./models/Case');
    
    const totalClients = await Client.countDocuments();
    const totalCases = await Case.countDocuments();
    const openCases = await Case.countDocuments({ status: 'open' });
    const closedCases = await Case.countDocuments({ status: 'closed' });
    const adjournedCases = await Case.countDocuments({ status: 'adjourned' });
    
    // Get recent cases (last 5)
    const recentCases = await Case.find()
      .populate('clientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title caseNumber status createdAt clientId');
    
    res.json({
      totalClients,
      totalCases,
      openCases,
      closedCases,
      adjournedCases,
      recentCases
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://MegoDB:xgKwWUL1clsSECso@cluster0.rchlmdg.mongodb.net/app-data-remon?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
