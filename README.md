# RastAI - Intelligent Anomaly Reporting Platform 

A comprehensive web-based platform that enables citizens to report anomalies with AI-powered verification, crowd-sourced validation, and real-time mapping for authorities to prioritize and respond to incidents effectively.

## 🌟 Features

### For Citizens
- **Multi-modal Reporting**: Upload images, select categories, add descriptions, and use speech-to-text conversion
- **AI-Powered Keywords**: Automatic extraction of relevant keywords from reports
- **Gamification**: Earn points for community engagement and verified reports
- **Real-time Map**: View ongoing anomalies and their status in your area

### For Authorities
- **Smart Prioritization**: ML-powered categorization with star ratings for incident severity
- **Three-tier Verification System**:
  1. **AI Scam Detection**: Automated filtering of fraudulent reports
  2. **Crowd-sourced Validation**: Geo-located SMS verification with community yes/no votes
  3. **Authority Verification**: Final review and action by relevant authorities
- **Dashboard Analytics**: Comprehensive overview of incidents and trends

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── Layout/
│   │   └── Navigation.tsx
│   ├── Map/
│   │   └── ReportMap.tsx
│   └── UI/
│       ├── Badge.tsx
│       └── StatCard.tsx
├── context/
│   └── UserContext.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Profile.tsx
│   └── ReportIncident.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── App.tsx
```

### Backend (Node.js + Express)
```
backend/
├── server.js
├── package.json
└── package-lock.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** with TypeScript for robust UI development
- **Vite** for fast development and building
- **React Router Dom** for navigation
- **Tailwind CSS** for responsive styling
- **Leaflet & React-Leaflet** for interactive mapping
- **Chart.js & React-Chartjs-2** for data visualization
- **Lucide React** for modern icons
- **Axios** for API communication

### Backend
- **Node.js** with Express framework
- **CORS** enabled for cross-origin requests
- RESTful API architecture

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **Nodemon** for backend development

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rastai.git
   cd rastai
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_MAP_API_KEY=your_map_api_key
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 📱 Usage

### Reporting an Incident
1. Navigate to the "Report Incident" page
2. Upload an image of the anomaly
3. Select appropriate category
4. Add description or use speech-to-text
5. Submit for AI processing and community verification

### Viewing Reports
- Use the interactive map to see real-time incidents
- Filter by category, severity, or verification status
- Track your contribution points in the profile section

### Authority Dashboard
- Monitor incoming reports with priority rankings
- Review AI-flagged suspicious reports
- Access crowd-sourced validation results
- Take action and update incident status

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Project Structure Highlights
- **Modular Components**: Reusable UI components with TypeScript interfaces
- **Context Management**: Centralized user state management
- **Service Layer**: Abstracted API calls for maintainability
- **Type Definitions**: Comprehensive TypeScript types for data consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Machine Learning pipeline integration
- [ ] SMS verification system implementation
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline reporting capabilities

##  Support

For support, email kaif.khan@northsouth.edu 

---

**Built with ❤️ for safer communities**
