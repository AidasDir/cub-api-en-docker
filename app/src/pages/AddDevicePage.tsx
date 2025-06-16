import React, { useState, useEffect } from 'react';
import { callCubApi } from '../api'; // Import callCubApi

const AddDevicePage: React.FC = () => {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const ACCESS_CODE_STORAGE_KEY = 'cub_add_device_code';

  const generateAndStoreAccessCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await callCubApi({
        endpoint: '/device/generate-code',
        method: 'GET',
      });

      if (response.success && response.data && typeof response.data === 'object' && 'code' in response.data) {
        const newCode = String(response.data.code);
        setGeneratedCode(newCode.split('').join(' ')); // Format with spaces
        localStorage.setItem(ACCESS_CODE_STORAGE_KEY, newCode); // Store in localStorage
      } else {
        setError(response.error || 'Failed to generate access code.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCode = localStorage.getItem(ACCESS_CODE_STORAGE_KEY);
    if (storedCode) {
      setGeneratedCode(storedCode.split('').join(' ')); // Format stored code with spaces
      setLoading(false);
    } else {
      generateAndStoreAccessCode();
    }
  }, []);

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Adding a new device</h2>

      {loading ? (
        <p className="text-xl text-gray-600">Generating code...</p>
      ) : error ? (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md w-full max-w-md text-center">
          <h3 className="font-semibold text-lg mb-2">Error:</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="text-6xl md:text-8xl font-extrabold tracking-widest text-[#aa566f] mb-8 select-all p-4 border-b-2 border-[#aa566f]/50">
            {generatedCode}
          </div>
          <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
            This code will be available for 20 minutes. Go to the app, then to Settings-Account and click the "Log in" button.
          </p>
          <button
            onClick={generateAndStoreAccessCode}
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Refresh code
          </button>
        </>
      )}
    </div>
  );
};

export default AddDevicePage; 