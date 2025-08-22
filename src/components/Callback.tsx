import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      setAccessToken(accessToken);
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [setAccessToken, navigate]);

  return (
    <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
        <p className="text-spotify-gray">Conectando con Spotify...</p>
      </div>
    </div>
  );
};

export default Callback;
