"use client";
import { updateUserProfile } from '@/lib/api';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';

interface User {
  fullName: string;
  bio: string;
  avatarUrl?: string;
  pronouns: string;
  username: string;
}

interface EditProfileModalProps {
  onClose: () => void;
  user: User;
}

export default function EditProfileModal({ onClose, user }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    bio: user.bio,
    pronouns: user.pronouns,
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
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        // Refresh the page to show updated profile
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XIcon size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-center">Edit Profile</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-300 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white opacity-70"
            />
            <p className="text-xs text-zinc-400 mt-1">Username cannot be changed</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="pronouns" className="block text-sm font-medium mb-1">Pronouns</label>
            <input
              id="pronouns"
              name="pronouns"
              type="text"
              value={formData.pronouns}
              onChange={handleChange}
              placeholder="e.g. they/them"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white resize-none"
            />
          </div>
          
          <div className="border-t border-zinc-700 my-6 pt-6">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-md mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
