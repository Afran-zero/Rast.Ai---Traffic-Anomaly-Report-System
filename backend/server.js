const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data
let reports = [
  {
    id: 1,
    category: "Accident",
    location: { lat: 23.7925, lng: 90.4078, address: "Gulshan Circle 1" },
    description: "Multi-vehicle collision blocking traffic",
    severity: 5,
    verified: true,
    status: "Assigned to Police",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_001"
  },
  {
    id: 2,
    category: "Wrong-Way Driving",
    location: { lat: 23.7776, lng: 90.4066, address: "Mohakhali Flyover" },
    description: "Motorcycle going against traffic on flyover",
    severity: 3,
    verified: true,
    status: "Pending",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_002"
  },
  {
    id: 3,
    category: "Illegal Toll",
    location: { lat: 23.8103, lng: 90.4125, address: "Banani Main Road" },
    description: "Unauthorized toll collection by local goons",
    severity: 4,
    verified: false,
    status: "Under Review",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_003"
  },
  {
    id: 4,
    category: "Roadblock",
    location: { lat: 23.7461, lng: 90.3742, address: "Dhanmondi 27" },
    description: "Construction debris blocking lane",
    severity: 4,
    verified: true,
    status: "Resolved",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_004"
  },
  {
    id: 5,
    category: "Pothole",
    location: { lat: 23.7279, lng: 90.4053, address: "Elephant Road" },
    description: "Large pothole causing vehicle damage",
    severity: 2,
    verified: true,
    status: "Assigned to DSCC",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_005"
  },
  {
    id: 6,
    category: "Illegal Stop",
    location: { lat: 23.7644, lng: 90.3756, address: "New Market Area" },
    description: "Bus stopping in no-parking zone",
    severity: 2,
    verified: false,
    status: "Pending",
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    reporterId: "citizen_006"
  }
];

// Risk zones (hardcoded for demo)
const riskZones = [
  { lat: 23.7925, lng: 90.4078, name: "Gulshan Circle 1", riskLevel: 85, type: "High Traffic" },
  { lat: 23.7776, lng: 90.4066, name: "Mohakhali Flyover", riskLevel: 90, type: "Accident Prone" },
  { lat: 23.8103, lng: 90.4125, name: "Banani", riskLevel: 75, type: "Congestion" },
];

let nextId = 7;

// Dummy ML severity calculation
function calculateSeverity(category) {
  const severityMap = {
    "Accident": 5,
    "Roadblock": 4,
    "Illegal Toll": 4,
    "Wrong-Way Driving": 3,
    "Illegal Stop": 2,
    "Pothole": 2
  };
  return severityMap[category] || 1;
}

// Dummy verification (70% chance of being verified)
function simulateVerification() {
  return Math.random() > 0.3;
}

// Routes
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const { category, location, description } = req.body;
  
  const newReport = {
    id: nextId++,
    category,
    location,
    description,
    severity: calculateSeverity(category),
    verified: simulateVerification(),
    status: "Pending",
    timestamp: new Date().toISOString(),
    reporterId: `citizen_${Math.random().toString(36).substr(2, 9)}`
  };
  
  reports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

app.get('/api/dashboard', (req, res) => {
  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'Pending').length,
    resolvedReports: reports.filter(r => r.status === 'Resolved').length,
    verifiedReports: reports.filter(r => r.verified).length,
    categoryStats: {
      "Accident": reports.filter(r => r.category === 'Accident').length,
      "Wrong-Way Driving": reports.filter(r => r.category === 'Wrong-Way Driving').length,
      "Illegal Toll": reports.filter(r => r.category === 'Illegal Toll').length,
      "Roadblock": reports.filter(r => r.category === 'Roadblock').length,
      "Illegal Stop": reports.filter(r => r.category === 'Illegal Stop').length,
      "Pothole": reports.filter(r => r.category === 'Pothole').length,
    }
  };
  res.json(stats);
});

app.get('/api/risk-zones', (req, res) => {
  res.json(riskZones);
});

app.put('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const reportIndex = reports.findIndex(r => r.id === parseInt(id));
  if (reportIndex !== -1) {
    reports[reportIndex].status = status;
    res.json({ success: true, report: reports[reportIndex] });
  } else {
    res.status(404).json({ success: false, error: 'Report not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});