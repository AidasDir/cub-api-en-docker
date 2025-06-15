import React, { useState, useEffect } from 'react';
import { callCubApi } from '../api'; // Import callCubApi

interface AccessCodePageProps {
  userEmail: string | null;
  setToken: (token: string) => void; // Add setToken to props
  setProfile: (profile: string) => void; // Add setProfile to props
  token: string | null;
}

const AccessCodePage: React.FC<AccessCodePageProps> = ({ userEmail, setToken, setProfile, token }) => {
  const [deviceCode, setDeviceCode] = useState<string>('');
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const ACCESS_CODE_STORAGE_KEY = 'cub_access_code';

  const generateAndStoreAccessCode = async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Token'] = token;
      }

      const response = await callCubApi({
        endpoint: '/device/generate-code',
        method: 'GET',
        headers: headers,
      });

      if (response.success && response.data && typeof response.data === 'object' && 'code' in response.data) {
        const newCode = String(response.data.code);
        setGeneratedCode(newCode);
        setDeviceCode(newCode);
        localStorage.setItem(ACCESS_CODE_STORAGE_KEY, newCode); // Store in localStorage
      } else {
        setError(response.error || 'Failed to generate access code.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating code.');
    }
  };

  useEffect(() => {
    const storedCode = localStorage.getItem(ACCESS_CODE_STORAGE_KEY);
    if (storedCode) {
      setGeneratedCode(storedCode);
      setDeviceCode(storedCode);
    } else {
      generateAndStoreAccessCode();
    }
  }, []);

  const handleRefreshCode = () => {
    setError(null);
    setLocalToken(null);
    generateAndStoreAccessCode();
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setLocalToken(null);

      const response = await callCubApi({
        endpoint: '/device/add',
        method: 'POST',
        body: { code: deviceCode, email: userEmail }
      });

      if (response.success && response.data && typeof response.data === 'object') {
        const { token: receivedToken, profile } = response.data as { token?: string; profile?: { id: number | string } };
        if (receivedToken) {
          setLocalToken(receivedToken);
          setToken(receivedToken); // Update App.tsx token state
          localStorage.setItem('cub_api_token', receivedToken); // Store token in localStorage
        }
        if (profile?.id) {
          setProfile(String(profile.id)); // Update App.tsx profile state, explicitly cast to string
          localStorage.setItem('cub_api_profile', String(profile.id)); // Store profile ID in localStorage
        }
      } else {
        setError(response.error || 'Failed to obtain token.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Obtain Access Code</h2>
      <div className="mb-4">
        <label htmlFor="deviceCode" className="block text-sm font-medium text-gray-700">Device Code:</label>
        <input
          type="text"
          id="deviceCode"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={deviceCode}
          onChange={(e) => setDeviceCode(e.target.value)}
          placeholder="Enter your device code"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Token
      </button>

      {generatedCode && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <h3 className="font-semibold">Generated Access Code:</h3>
          <p className="break-all font-mono text-sm">{generatedCode}</p>
          <p className="mt-2 text-sm">This code has been automatically filled into the "Device Code" input field above. Click "Get Token" to authenticate.</p>
          <button
            onClick={handleRefreshCode}
            className="mt-2 text-sm text-blue-700 underline hover:text-blue-900 focus:outline-none"
          >
            Refresh Code
          </button>
        </div>
      )}

      {localToken && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-semibold">Token Obtained Successfully!</h3>
          <p className="break-all">Token: <span className="font-mono text-sm">{localToken}</span></p>
          <p className="mt-2 text-sm">Please copy this token and use it in the Authorization header for authenticated API calls (e.g., `Authorization: Bearer ${localToken}`).</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AccessCodePage; 