import React, { useState } from 'react';
import { Magic } from 'magic-sdk';

// TODO: Replace with your actual Magic.link Publishable API Key
const magic = new Magic('pk_live_DF7C05FE3A4FD8A6');

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use Magic's built-in UI for passwordless login
      await magic.wallet.connectWithUI();
      // After successful login, get user info
      const metadata = await magic.user.getInfo();
      if (metadata.email) {
        onLoginSuccess(metadata.email);
      } else {
        setError('Failed to retrieve user email after login.');
      }
    } catch (err: any) {
      console.error('Magic Link login error:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <button
          onClick={handleLogin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? 'Sending Magic Link...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 