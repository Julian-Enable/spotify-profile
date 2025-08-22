import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { spotifyService } from '../services/spotifyService';
import { SpotifyArtist, SpotifyTrack } from '../types/spotify';
import TopArtists from './TopArtists';
import TopTracks from './TopTracks';
import Recommendations from './Recommendations';
import UserProfile from './UserProfile';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, tracksData] = await Promise.all([
          spotifyService.getTopArtists('medium_term', 10),
          spotifyService.getTopTracks('medium_term', 10)
        ]);
        
        setTopArtists(artistsData.items as SpotifyArtist[]);
        setTopTracks(tracksData.items as SpotifyTrack[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'profile', name: 'Mi Perfil', icon: '👤' },
    { id: 'artists', name: 'Artistas Favoritos', icon: '🎤' },
    { id: 'tracks', name: 'Canciones Favoritas', icon: '🎵' },
    { id: 'recommendations', name: 'Recomendaciones', icon: '🎧' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p className="text-spotify-gray">Cargando tu perfil musical...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-dark">
      {/* Header */}
      <header className="bg-spotify-black border-b border-spotify-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-spotify-green rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">Mi Perfil de Spotify</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  {user.images && user.images[0] && (
                    <img
                      src={user.images[0].url}
                      alt={user.display_name}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-white font-medium">{user.display_name}</span>
                </div>
              )}
              <button
                onClick={logout}
                className="bg-spotify-light hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-spotify-black border-b border-spotify-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                  activeTab === tab.id
                    ? 'border-spotify-green text-spotify-green'
                    : 'border-transparent text-spotify-gray hover:text-white hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <UserProfile user={user} />}
        {activeTab === 'artists' && <TopArtists artists={topArtists} />}
        {activeTab === 'tracks' && <TopTracks tracks={topTracks} />}
        {activeTab === 'recommendations' && <Recommendations topArtists={topArtists} topTracks={topTracks} />}
      </main>
    </div>
  );
};

export default Dashboard;
