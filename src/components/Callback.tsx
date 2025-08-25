import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    // Verificar si es Authorization Code Flow (code en query params)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      alert('Error en la autenticación: ' + error);
      navigate('/');
      return;
    }

    if (code) {
      // Si tenemos un código pero no podemos intercambiarlo, redirigir a Implicit Flow
      console.log('Authorization Code recibido, pero redirigiendo a Implicit Flow para evitar problemas de proxy');
      const authUrl = `https://accounts.spotify.com/authorize?client_id=6a33f98b08844547828ddcd86394c8ce&response_type=token&redirect_uri=${encodeURIComponent('https://spotifyprofile.netlify.app/callback')}&scope=${encodeURIComponent('user-read-private user-read-email user-top-read')}&show_dialog=true`;
      window.location.href = authUrl;
      return;
    }

    // Verificar si es Implicit Flow (token en hash)
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');
    const hashError = hashParams.get('error');

    if (hashError) {
      console.error('Spotify auth error:', hashError);
      alert('Error en la autenticación: ' + hashError);
      navigate('/');
      return;
    }

    if (accessToken) {
      // Implicit Flow - token directo
      console.log('Token recibido via Implicit Flow');
      setAccessToken(accessToken);
      navigate('/dashboard');
      return;
    }

    // Si no hay ni code ni token, redirigir al inicio
    console.error('No authorization code or access token found');
    navigate('/');
  }, [navigate, setAccessToken]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '2px solid #1DB954',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px auto'
        }}></div>
        <p style={{ color: '#B3B3B3' }}>Conectando con Spotify...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Callback;
