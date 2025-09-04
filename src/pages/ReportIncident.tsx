import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Send, CheckCircle } from 'lucide-react';
import { reportsAPI } from '../services/api';
import { useUser } from '../context/UserContext';

const CATEGORIES = [
  { value: 'Accident', label: 'Accident', icon: '🚑', color: 'red' },
  { value: 'Wrong-Way Driving', label: 'Wrong-Way Driving', icon: '↔️', color: 'orange' },
  { value: 'Illegal Stop', label: 'Illegal Stop', icon: '🚌', color: 'yellow' },
  { value: 'Illegal Toll', label: 'Illegal Toll', icon: '💸', color: 'purple' },
  { value: 'Roadblock', label: 'Roadblock', icon: '⛔', color: 'red' },
  { value: 'Pothole', label: 'Pothole', icon: '🕳️', color: 'gray' },
];

export function ReportIncident() {
  const navigate = useNavigate();
  const { addPoints, isLoggedIn, login } = useUser();
  const [formData, setFormData] = useState({
    category: '',
    location: {
      address: '',
      lat: 23.8103,
      lng: 90.4125,
    },
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn && !tempUsername) {
      alert('Please enter your name to submit a report');
      return;
    }

    if (!isLoggedIn && tempUsername) {
      login(tempUsername);
    }

    setIsSubmitting(true);

    try {
      await reportsAPI.createReport(formData);
      addPoints(10); // Award points for reporting
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        category: '',
        location: { address: '', lat: 23.8103, lng: 90.4125 },
        description: '',
      });
      
      setTimeout(() => {
        navigate('/map');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for making our roads safer. Your report has been submitted and will be reviewed by authorities.
          </p>
          <p className="text-sm text-teal-600 font-semibold">+10 points earned! 🏆</p>
          <p className="text-xs text-gray-500 mt-2">Redirecting to live map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-orange-600 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <AlertTriangle className="mr-3 h-6 w-6" />
              Report Traffic Incident
            </h1>
            <p className="mt-2 text-teal-100">Help make Dhaka's roads safer by reporting issues</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info (if not logged in) */}
            {!isLoggedIn && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (for demo purposes)
                </label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Incident Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.value })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.category === category.value
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                placeholder="Enter location (e.g., Gulshan Circle 1)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                For demo: Use area names like "Gulshan", "Mohakhali", "Dhanmondi", etc.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the incident in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Photo/Video Placeholder */}
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm">Photo/Video Upload</p>
                <p className="text-xs text-gray-400">Coming in full version</p>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Safety Tips</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Report from a safe location</li>
                <li>• Do not interfere with ongoing incidents</li>
                <li>• Call emergency services (999) for serious accidents</li>
                <li>• All reports are anonymous</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.category || !formData.location.address || !formData.description}
              className="w-full bg-gradient-to-r from-teal-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}