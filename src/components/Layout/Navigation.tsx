import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, BarChart3, FileText, User, LogOut } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export function Navigation() {
  const location = useLocation();
  const { isLoggedIn, username, logout } = useUser();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/report', label: 'Report', icon: FileText },
    { path: '/map', label: 'Live Map', icon: MapPin },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-teal-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Rast.Ai</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Hi, {username}</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/profile"
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 text-xs ${
                isActive(item.path) ? 'text-teal-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}