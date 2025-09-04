import React, { useState } from 'react';
import { User, Trophy, Award, Star, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Badge } from '../components/UI/Badge';

export function Profile() {
  const { userStats, isLoggedIn, login, logout, username } = useUser();
  const [loginForm, setLoginForm] = useState({ username: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username.trim()) {
      login(loginForm.username.trim());
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Traffic Hero': return 'warning';
      case 'Road Guardian': return 'info';
      case 'Safety Champion': return 'success';
      default: return 'default';
    }
  };

  const getPointsToNextBadge = () => {
    const points = userStats.points;
    if (points < 50) return 50 - points;
    if (points < 100) return 100 - points;
    if (points < 200) return 200 - points;
    return 0;
  };

  const getNextBadge = () => {
    const points = userStats.points;
    if (points < 50) return 'Traffic Hero';
    if (points < 100) return 'Road Guardian';
    if (points < 200) return 'Safety Champion';
    return 'Master Guardian';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to TrafficBondhu</h1>
            <p className="text-gray-600 mt-2">Enter your name to start earning points and badges</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ username: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Get Started
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            This is a demo app. No real authentication required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-orange-600 text-white p-8">
            <div className="flex items-center space-x-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {username}!</h1>
                <p className="text-teal-100 mt-1">Community Safety Champion</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-lg mb-3">
                  <Trophy className="h-8 w-8 text-teal-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.points}</h3>
                <p className="text-gray-600">Points Earned</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-lg mb-3">
                  <Star className="h-8 w-8 text-orange-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.reportsSubmitted}</h3>
                <p className="text-gray-600">Reports Submitted</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-lg mb-3">
                  <Award className="h-8 w-8 text-purple-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userStats.badges.length}</h3>
                <p className="text-gray-600">Badges Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Badges</h2>
          
          {userStats.badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {userStats.badges.map((badge, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{badge}</h3>
                      <Badge variant={getBadgeVariant(badge)} size="sm">
                        Earned
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No badges earned yet. Submit reports to earn your first badge!</p>
            </div>
          )}

          {/* Next Badge Progress */}
          {getPointsToNextBadge() > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Next Badge: {getNextBadge()}</h3>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((userStats.points % 50) / 50) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {getPointsToNextBadge()} points to go
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Earned 10 points</p>
                <p className="text-sm text-gray-500">For submitting a traffic report</p>
              </div>
            </div>
            {userStats.badges.length > 0 && (
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Badge Earned: {userStats.badges[userStats.badges.length - 1]}</p>
                  <p className="text-sm text-gray-500">Keep up the great work!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Theme</h3>
                <p className="text-sm text-gray-500">Switch between light and dark mode</p>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-1">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Language</h3>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
              <select className="border border-gray-300 rounded-md px-3 py-1">
                <option>English</option>
                <option>বাংলা (Coming Soon)</option>
              </select>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}