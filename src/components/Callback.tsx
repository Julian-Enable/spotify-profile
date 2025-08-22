import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const exchangeCodeForToken = useCallback(async (code: string) => {
    try {
      const codeVerifier = localStorage.getItem('code_verifier');
      if (!codeVerifier) {
        console.error('No code verifier found');
        navigate('/');
        return;
      }

      // Usar un proxy público para intercambiar el código por token
      const response = await fetch('https://spotify-auth-proxy.vercel.app/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          code_verifier: codeVerifier,
          redirect_uri: 'https://spotifyprofile.netlify.app/callback',
          client_id: '6a33f98b08844547828ddcd86394c8ce'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.removeItem('code_verifier');
          navigate('/dashboard');
        } else {
          throw new Error('No access token received');
        }
      } else {
        throw new Error('Failed to exchange code for token');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      // Fallback: mostrar información para debugging
      alert('Error en la autenticación. Revisa la consola para más detalles.');
      navigate('/');
    }
  }, [navigate, setAccessToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      navigate('/');
      return;
    }

    if (code) {
      // Intercambiar el código por un token usando PKCE
      exchangeCodeForToken(code);
    } else {
      navigate('/');
    }
  }, [navigate, setAccessToken, exchangeCodeForToken]);

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
