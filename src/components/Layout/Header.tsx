import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <span className="text-sm font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;