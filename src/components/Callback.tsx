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
          return;
        }
      }

      // Si el proxy falla, intentar con otro
      console.log('Primer proxy falló, intentando con alternativo...');
      const response2 = await fetch('https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://spotifyprofile.netlify.app'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'https://spotifyprofile.netlify.app/callback',
          client_id: '6a33f98b08844547828ddcd86394c8ce',
          code_verifier: codeVerifier
        }).toString(),
      });

      if (response2.ok) {
        const data = await response2.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.removeItem('code_verifier');
          navigate('/dashboard');
          return;
        }
      }

      throw new Error('Failed to exchange code for token');
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      alert('Error en la autenticación. Revisa la consola para más detalles.');
      navigate('/');
    }
  }, [navigate, setAccessToken]);

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
      // Authorization Code Flow
      exchangeCodeForToken(code);
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
      // Implicit Flow
      setAccessToken(accessToken);
      navigate('/dashboard');
      return;
    }

    // Si no hay ni code ni token, redirigir al inicio
    console.error('No authorization code or access token found');
    navigate('/');
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
