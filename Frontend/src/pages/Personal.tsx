import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Shield, Bell, CreditCard } from 'lucide-react';
import { profileApi } from '../services/api';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  company: string;
  preferences: {
    notifications: boolean;
    sms: boolean;
    marketing: boolean;
    reports: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    deviceTracking: boolean;
  };
}

const Personal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (profileData) {
      setProfileData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      await profileApi.updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const connectedAccounts = [
    { name: 'Chase Bank', type: 'Primary', status: 'Connected', lastSync: '2 hours ago' },
    { name: 'Wells Fargo', type: 'Savings', status: 'Connected', lastSync: '1 day ago' },
    { name: 'PayPal', type: 'Digital Wallet', status: 'Disconnected', lastSync: 'Never' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Personal Profile</h1>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
        >
          <Edit3 size={20} />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profileData.name}</h2>
            <p className="text-gray-400">{profileData.occupation}</p>
            <p className="text-gray-400">{profileData.company}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-white">{profileData.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-white">{profileData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-white">{profileData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-white">{profileData.address}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-white">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {Object.entries(profileData.preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-400" size={20} />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(profileData.security).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="text-emerald-500" size={20} />
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  value ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {value ? 'Active' : 'Inactive'}
                </span>
                <button className="text-emerald-500 hover:text-emerald-400 text-sm">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-gray-800 text-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-6">Connected Accounts</h3>
        <div className="space-y-4">
          {connectedAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-gray-400" size={20} />
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-gray-400">{account.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  account.status === 'Connected' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {account.status}
                </div>
                <div className="text-xs text-gray-400">Last sync: {account.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Personal;