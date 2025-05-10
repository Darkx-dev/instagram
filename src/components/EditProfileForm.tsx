"use client";
import { updateUserProfile } from '@/lib/api';
import { Camera, Save } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  pronouns: string | null;
  username: string;
}

interface EditProfileFormProps {
  user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    bio: user.bio || '',
    pronouns: user.pronouns || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate passwords if attempting to change
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (formData.newPassword.length < 8) {
        setError('New password must be at least 8 characters');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API call
      const updateData: any = {
        fullName: formData.fullName,
        bio: formData.bio,
        pronouns: formData.pronouns,
      };
      
      // Only include password fields if attempting to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      await updateUserProfile(updateData);
      setSuccess('Profile updated successfully');
      
      // Clear password fields after successful update
      if (formData.newPassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Notification area */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-start justify-between">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError('')} className="text-red-300 hover:text-white">
            <span className="sr-only">Dismiss</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-4 flex items-start justify-between">
          <p className="text-sm">{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-300 hover:text-white">
            <span className="sr-only">Dismiss</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <form id="profile-form" onSubmit={handleSubmit}>
        {activeTab === 'profile' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex flex-row gap-6 mb-6 items-center">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName}
                    width={80}
                    height={80}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-semibold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors"
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Quick info */}
              <div className="flex-grow">
                <h2 className="text-lg font-medium mb-1">{user.fullName}</h2>
                <p className="text-sm text-zinc-400">@{user.username}</p>
              </div>

              {/* Upload button */}
              <div className="flex-shrink-0">
                <button 
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Form fields in 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1.5 text-zinc-300">Username</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white opacity-70 text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">Cannot be changed</p>
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1.5 text-zinc-300">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="pronouns" className="block text-sm font-medium mb-1.5 text-zinc-300">Pronouns</label>
                <input
                  id="pronouns"
                  name="pronouns"
                  type="text"
                  value={formData.pronouns}
                  onChange={handleChange}
                  placeholder="e.g. they/them"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium mb-1.5 text-zinc-300">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-sm"
                  placeholder="Tell others a bit about yourself..."
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-zinc-500">Markdown supported</p>
                  <p className="text-xs text-zinc-500">{formData.bio.length}/500</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1.5 text-zinc-300">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">Required to change your password</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5 text-zinc-300">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5 text-zinc-300">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>
              
              <div className="bg-zinc-800 border border-zinc-700 rounded-md p-3 mt-3">
                <h3 className="font-medium text-sm text-zinc-300 mb-2">Password Requirements</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className={`flex items-center gap-1.5 text-xs ${formData.newPassword.length >= 8 ? 'text-green-400' : 'text-zinc-400'}`}>
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {formData.newPassword.length >= 8 ? 
                        <path d="M20 6L9 17l-5-5" /> : 
                        <circle cx="12" cy="12" r="10" />
                      }
                    </svg>
                    8+ characters
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : 'text-zinc-400'}`}>
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {/[A-Z]/.test(formData.newPassword) ? 
                        <path d="M20 6L9 17l-5-5" /> : 
                        <circle cx="12" cy="12" r="10" />
                      }
                    </svg>
                    Uppercase
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${/[0-9]/.test(formData.newPassword) ? 'text-green-400' : 'text-zinc-400'}`}>
                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {/[0-9]/.test(formData.newPassword) ? 
                        <path d="M20 6L9 17l-5-5" /> : 
                        <circle cx="12" cy="12" r="10" />
                      }
                    </svg>
                    Number
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}