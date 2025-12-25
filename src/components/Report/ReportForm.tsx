import React, { useState } from 'react';
import { MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useIssues } from '../../contexts/IssuesContext';
import { useAuth } from '../../contexts/AuthContext';
import { IssueCategory, IssuePriority } from '../../types';

export const ReportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as IssueCategory,
    priority: 'medium' as IssuePriority,
    address: '',
    coordinates: null as { lat: number; lng: number } | null
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addIssue } = useIssues();
  const { user } = useAuth();

  const categoryOptions = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'streetlight', label: 'Streetlight' },
    { value: 'garbage', label: 'Garbage Collection' },
    { value: 'graffiti', label: 'Graffiti' },
    { value: 'traffic_signal', label: 'Traffic Signal' },
    { value: 'water_leak', label: 'Water Leak' },
    { value: 'noise', label: 'Noise Complaint' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Non-urgent, can wait' },
    { value: 'medium', label: 'Medium', description: 'Standard priority' },
    { value: 'high', label: 'High', description: 'Needs attention soon' },
    { value: 'critical', label: 'Critical', description: 'Safety hazard, urgent' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Location address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus('submitting');

    try {
      addIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'reported',
        location: {
          address: formData.address,
          coordinates: formData.coordinates
        },
        reportedBy: {
          id: user!.id,
          name: user!.name
        }
      });

      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        address: '',
        coordinates: null
      });

      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          
          // In a real app, you'd reverse geocode these coordinates to get an address
          setFormData(prev => ({
            ...prev,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-amber-900 mb-2">Sign In Required</h2>
          <p className="text-amber-700">You must be signed in to report civic issues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Civic Issue</h1>
          <p className="text-gray-600">Help improve your community by reporting issues that need attention.</p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
            <div>
              <p className="text-emerald-800 font-medium">Issue reported successfully!</p>
              <p className="text-emerald-700 text-sm">Your report has been submitted and will be reviewed by the appropriate authorities.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">There was an error submitting your report. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as IssueCategory }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Briefly describe the issue (e.g., 'Large pothole on Main Street')"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide a detailed description of the issue, including any relevant details that would help authorities understand and address the problem."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {priorityOptions.map(option => (
                <label
                  key={option.value}
                  className={`relative flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.priority === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as IssuePriority }))}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${
                      formData.priority === option.value ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </p>
                    <p className={`text-sm ${
                      formData.priority === option.value ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter the street address or intersection"
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Get current location"
              >
                <MapPin className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            {formData.coordinates && (
              <p className="mt-1 text-sm text-green-600">📍 Location coordinates captured</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Coming Soon)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Photo upload functionality will be available soon.</p>
              <p className="text-sm text-gray-500 mt-1">For now, please include detailed descriptions.</p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitStatus === 'submitting' ? 'Submitting Report...' : 'Submit Issue Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};