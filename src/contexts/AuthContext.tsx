import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SpotifyUser } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

// Función para generar PKCE challenge
function generateCodeVerifier(length: number) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generateCodeChallenge(codeVerifier: string) {
  return btoa(codeVerifier)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

interface AuthContextType {
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CLIENT_ID = '6a33f98b08844547828ddcd86394c8ce'; // Necesitarás crear una app en Spotify Developer Dashboard
// Para desarrollo local
// const REDIRECT_URI = 'https://localhost:3000/callback';

// Para Netlify (URL real)
const REDIRECT_URI = 'https://spotifyprofile.netlify.app/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read'
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = () => {
    const codeVerifier = generateCodeVerifier(128);
    const codeChallenge = generateCodeChallenge(codeVerifier);
    
    // Guardar el code_verifier para usarlo después
    localStorage.setItem('code_verifier', codeVerifier);
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES.join(' '))}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spotify_access_token');
    spotifyService.setAccessToken('');
  };

  const setAccessToken = useCallback(async (token: string) => {
    localStorage.setItem('spotify_access_token', token);
    spotifyService.setAccessToken(token);
    
    try {
      const userData = await spotifyService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setAccessToken(token);
    }
    setIsLoading(false);
  }, [setAccessToken]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
