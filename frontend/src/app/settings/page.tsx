'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile');
  const [profileImage, setProfileImage] = useState('/woman.png');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'module_updates',
      title: 'Module Updates',
      description: 'Get notified when new learning modules are available',
      enabled: true,
    },
    {
      id: 'quiz_reminders',
      title: 'Quiz Reminders',
      description: 'Receive reminders about upcoming or incomplete quizzes',
      enabled: true,
    },
    {
      id: 'achievement',
      title: 'Achievement Notifications',
      description: 'Get notified when you earn new achievements',
      enabled: true,
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard Updates',
      description: 'Receive updates about your leaderboard position',
      enabled: false,
    },
  ]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    company: 'Truest Bank',
    role: 'Financial Analyst',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Here you would typically save the changes to a backend
    console.log('Saving changes:', { formData, notificationSettings, theme, fontSize });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 border-b border-[#F3F0F4]">
          <div className="flex items-center gap-8">
            <Link href="/learning/dashboard" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Truest Assist Logo"
                width={150}
                height={32}
                className="object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveChanges}
              className="bg-[#612665] text-white px-6 py-2 rounded-lg hover:bg-[#4d1e51] transition-colors"
            >
              Save Changes
            </button>
            <Link 
              href="/learning/dashboard"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F0F4] transition-colors text-[#612665]"
              aria-label="Close settings"
            >
              ✕
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-[#612665] mb-8">Settings</h1>

          <div className="flex gap-8">
            {/* Settings Navigation */}
            <div className="w-64">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-[#F3F0F4] text-[#612665] font-semibold'
                      : 'text-[#b8a3be] hover:text-[#612665]'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-[#F3F0F4] text-[#612665] font-semibold'
                      : 'text-[#b8a3be] hover:text-[#612665]'
                  }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'appearance'
                      ? 'bg-[#F3F0F4] text-[#612665] font-semibold'
                      : 'text-[#b8a3be] hover:text-[#612665]'
                  }`}
                >
                  Appearance
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 bg-white rounded-xl border border-[#F3F0F4] p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#612665] mb-6">Profile Settings</h2>
                  
                  {/* Profile Image */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="relative">
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full"
                      />
                      <button className="absolute bottom-0 right-0 bg-[#612665] text-white p-2 rounded-full hover:bg-[#4d1e51] transition-colors">
                        <span className="text-sm">📷</span>
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#612665]">Profile Picture</h3>
                      <p className="text-sm text-[#b8a3be]">
                        Upload a new profile picture
                      </p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#612665] mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#F3F0F4] focus:border-[#612665] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#612665] mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#F3F0F4] focus:border-[#612665] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#612665] mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#F3F0F4] focus:border-[#612665] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#612665] mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#F3F0F4] focus:border-[#612665] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#612665] mb-2">Role</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border-2 border-[#F3F0F4] focus:border-[#612665] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#612665] mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {notificationSettings.map(setting => (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between p-4 rounded-lg border-2 border-[#F3F0F4]"
                      >
                        <div>
                          <h3 className="font-semibold text-[#612665]">{setting.title}</h3>
                          <p className="text-sm text-[#b8a3be]">{setting.description}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(setting.id)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${
                            setting.enabled ? 'bg-[#612665]' : 'bg-[#F3F0F4]'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              setting.enabled ? 'transform translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-[#612665] mb-6">Appearance Settings</h2>
                  
                  {/* Theme Selection */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-[#612665] mb-4">Theme</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                          theme === 'light'
                            ? 'border-[#612665] bg-[#F3F0F4] text-[#612665]'
                            : 'border-[#F3F0F4] text-[#b8a3be]'
                        }`}
                      >
                        Light Mode
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                          theme === 'dark'
                            ? 'border-[#612665] bg-[#F3F0F4] text-[#612665]'
                            : 'border-[#F3F0F4] text-[#b8a3be]'
                        }`}
                      >
                        Dark Mode
                      </button>
                    </div>
                  </div>

                  {/* Font Size Selection */}
                  <div>
                    <h3 className="font-semibold text-[#612665] mb-4">Font Size</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                          fontSize === 'normal'
                            ? 'border-[#612665] bg-[#F3F0F4] text-[#612665]'
                            : 'border-[#F3F0F4] text-[#b8a3be]'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                          fontSize === 'large'
                            ? 'border-[#612665] bg-[#F3F0F4] text-[#612665]'
                            : 'border-[#F3F0F4] text-[#b8a3be]'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage; 