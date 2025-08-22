import React, { useState, useEffect } from 'react';
import { SpotifyArtist, SpotifyTrack } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

interface RecommendationsProps {
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ topArtists, topTracks }) => {
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useEffect(() => {
    if (topArtists.length > 0 || topTracks.length > 0) {
      // Seleccionar automáticamente los primeros 2 artistas y 2 tracks
      const artistSeeds = topArtists.slice(0, 2).map(artist => artist.id);
      const trackSeeds = topTracks.slice(0, 2).map(track => track.id);
      
      setSelectedArtists(artistSeeds);
      setSelectedTracks(trackSeeds);
      
      fetchRecommendations(artistSeeds, trackSeeds);
    }
  }, [topArtists, topTracks]);

  const fetchRecommendations = async (artistSeeds: string[], trackSeeds: string[]) => {
    setIsLoading(true);
    try {
      const data = await spotifyService.getRecommendations(artistSeeds, trackSeeds, 20);
      setRecommendations(data.tracks);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtistToggle = (artistId: string) => {
    const newSelected = selectedArtists.includes(artistId)
      ? selectedArtists.filter(id => id !== artistId)
      : [...selectedArtists, artistId].slice(0, 3); // Máximo 3 artistas
    
    setSelectedArtists(newSelected);
    fetchRecommendations(newSelected, selectedTracks);
  };

  const handleTrackToggle = (trackId: string) => {
    const newSelected = selectedTracks.includes(trackId)
      ? selectedTracks.filter(id => id !== trackId)
      : [...selectedTracks, trackId].slice(0, 2); // Máximo 2 tracks
    
    setSelectedTracks(newSelected);
    fetchRecommendations(selectedArtists, newSelected);
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Recomendaciones Personalizadas
        </h2>
        <p className="text-spotify-gray">
          Descubre nueva música basada en tus artistas y canciones favoritas
        </p>
      </div>

      {/* Seed Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Artist Seeds */}
        <div className="bg-spotify-light rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Selecciona Artistas (máximo 3)
          </h3>
          <div className="space-y-3">
            {topArtists.slice(0, 5).map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleArtistToggle(artist.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                  selectedArtists.includes(artist.id)
                    ? 'bg-spotify-green text-white'
                    : 'bg-spotify-dark text-white hover:bg-gray-700'
                }`}
              >
                {artist.images && artist.images[0] ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-spotify-gray rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="font-medium">{artist.name}</span>
                {selectedArtists.includes(artist.id) && (
                  <svg className="h-5 w-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Track Seeds */}
        <div className="bg-spotify-light rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Selecciona Canciones (máximo 2)
          </h3>
          <div className="space-y-3">
            {topTracks.slice(0, 5).map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackToggle(track.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                  selectedTracks.includes(track.id)
                    ? 'bg-spotify-green text-white'
                    : 'bg-spotify-dark text-white hover:bg-gray-700'
                }`}
              >
                {track.album.images && track.album.images[0] ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-spotify-gray rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 text-left">
                  <div className="font-medium truncate">{track.name}</div>
                  <div className="text-sm opacity-75 truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </div>
                </div>
                {selectedTracks.includes(track.id) && (
                  <svg className="h-5 w-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p className="text-spotify-gray">Generando recomendaciones...</p>
        </div>
      )}

      {/* Recommendations */}
      {!isLoading && recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">
            Canciones Recomendadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((track) => (
              <div
                key={track.id}
                className="bg-spotify-light rounded-lg p-4 hover:bg-gray-700 transition duration-200 group"
              >
                <div className="mb-4">
                  {track.album.images && track.album.images[0] ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-spotify-gray rounded-lg flex items-center justify-center">
                      <svg className="h-16 w-16 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-white group-hover:text-spotify-green transition duration-200 truncate">
                    {track.name}
                  </h4>
                  <p className="text-spotify-gray text-sm truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="text-spotify-gray text-xs truncate">
                    {track.album.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-spotify-gray">
                    <span>{formatDuration(track.duration_ms)}</span>
                    <span>Popularidad: {track.popularity}%</span>
                  </div>
                  
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-spotify-green hover:text-green-400 text-sm font-medium transition duration-200"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span>Escuchar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay recomendaciones disponibles
          </h3>
          <p className="text-spotify-gray">
            Selecciona algunos artistas y canciones para obtener recomendaciones personalizadas
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
