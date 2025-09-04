import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, RiskZone } from '../../types';
import { reportsAPI, riskAPI } from '../../services/api';
import { Badge } from '../UI/Badge';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg" style="background-color: ${color};">
        <span class="text-white text-lg">${emoji}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const categoryIcons = {
  'Accident': createCustomIcon('#DC2626', '🚑'),
  'Wrong-Way Driving': createCustomIcon('#EA580C', '↔️'),
  'Illegal Stop': createCustomIcon('#D97706', '🚌'),
  'Illegal Toll': createCustomIcon('#7C3AED', '💸'),
  'Roadblock': createCustomIcon('#DC2626', '⛔'),
  'Pothole': createCustomIcon('#6B7280', '🕳️'),
};

function AutoRefresh({ onRefresh }: { onRefresh: () => void }) {
  const map = useMap();

  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [onRefresh]);

  return null;
}

export function ReportMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  const fetchData = async () => {
    try {
      const [reportsData, riskData] = await Promise.all([
        reportsAPI.getAllReports(),
        riskAPI.getRiskZones()
      ]);
      setReports(reportsData);
      setRiskZones(riskData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReports = selectedCategory === 'all' 
    ? reports 
    : reports.filter(report => report.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(reports.map(r => r.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live traffic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Traffic Map</h1>
            <p className="text-gray-600">Real-time traffic incidents across Dhaka</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Reports' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Reports</h2>
            <p className="text-sm text-gray-500">{filteredReports.length} incidents</p>
          </div>
          
          <div className="divide-y">
            {filteredReports.slice(0, 10).map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {report.category === 'Accident' && '🚑'}
                      {report.category === 'Wrong-Way Driving' && '↔️'}
                      {report.category === 'Illegal Stop' && '🚌'}
                      {report.category === 'Illegal Toll' && '💸'}
                      {report.category === 'Roadblock' && '⛔'}
                      {report.category === 'Pothole' && '🕳️'}
                    </span>
                    <span className="font-medium text-sm">{report.category}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(report.severity)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{report.location.address}</p>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{report.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={report.verified ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {report.verified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge 
                      variant={
                        report.status === 'Resolved' ? 'success' :
                        report.status === 'Pending' ? 'warning' : 'info'
                      } 
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(report.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            ref={mapRef}
            center={[23.8103, 90.4125]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <AutoRefresh onRefresh={fetchData} />
            
            {/* Report Markers */}
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.location.lat, report.location.lng]}
                icon={categoryIcons[report.category as keyof typeof categoryIcons]}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-60">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                      <span className="mr-2">
                        {report.category === 'Accident' && '🚑'}
                        {report.category === 'Wrong-Way Driving' && '↔️'}
                        {report.category === 'Illegal Stop' && '🚌'}
                        {report.category === 'Illegal Toll' && '💸'}
                        {report.category === 'Roadblock' && '⛔'}
                        {report.category === 'Pothole' && '🕳️'}
                      </span>
                      {report.category}
                    </h3>
                    
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Location:</strong> {report.location.address}</p>
                      <p className="text-sm"><strong>Description:</strong> {report.description}</p>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm"><strong>Severity:</strong></span>
                        {[...Array(report.severity)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={report.verified ? 'success' : 'warning'} size="sm">
                          {report.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <Badge 
                          variant={
                            report.status === 'Resolved' ? 'success' :
                            report.status === 'Pending' ? 'warning' : 'info'
                          } 
                          size="sm"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Reported: {new Date(report.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h3 className="font-semibold text-sm mb-2">Legend</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <span>🚑</span><span>Accidents</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>↔️</span><span>Wrong-Way Driving</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚌</span><span>Illegal Stops</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💸</span><span>Illegal Tolls</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⛔</span><span>Roadblocks</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕳️</span><span>Potholes</span>
              </div>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            className="absolute top-4 right-4 bg-teal-600 text-white p-2 rounded-lg shadow-lg hover:bg-teal-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}