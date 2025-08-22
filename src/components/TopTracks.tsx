import React, { useState, useEffect } from 'react';
import { SpotifyTrack } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

interface TopTracksProps {
  tracks: SpotifyTrack[];
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks: initialTracks }) => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>(initialTracks);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isLoading, setIsLoading] = useState(false);

  const timeRangeLabels = {
    short_term: 'Último mes',
    medium_term: 'Últimos 6 meses',
    long_term: 'Todo el tiempo'
  };

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const data = await spotifyService.getTopTracks(timeRange, 20);
        setTracks(data.items as SpotifyTrack[]);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange]);

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'text-green-400';
    if (popularity >= 60) return 'text-yellow-400';
    if (popularity >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Tus Canciones Favoritas
          </h2>
          <p className="text-spotify-gray">
            Descubre qué canciones has estado escuchando más
          </p>
        </div>
        
        <div className="flex space-x-2">
          {(['short_term', 'medium_term', 'long_term'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                timeRange === range
                  ? 'bg-spotify-green text-white'
                  : 'bg-spotify-light text-spotify-gray hover:text-white'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p className="text-spotify-gray">Cargando canciones...</p>
        </div>
      )}

      {/* Tracks list */}
      {!isLoading && (
        <div className="space-y-4">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="bg-spotify-light rounded-lg p-4 hover:bg-gray-700 transition duration-200 group"
            >
              <div className="flex items-center space-x-4">
                {/* Position */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-2xl font-bold text-spotify-gray group-hover:text-spotify-green transition duration-200">
                    {index + 1}
                  </span>
                </div>

                {/* Album cover */}
                <div className="flex-shrink-0">
                  {track.album.images && track.album.images[0] ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-spotify-gray rounded-lg flex items-center justify-center">
                      <svg className="h-8 w-8 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-spotify-green transition duration-200 truncate">
                    {track.name}
                  </h3>
                  <p className="text-spotify-gray text-sm truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="text-spotify-gray text-xs truncate">
                    {track.album.name}
                  </p>
                </div>

                {/* Popularity */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-spotify-gray text-xs">Popularidad:</span>
                    <span className={`text-xs font-medium ${getPopularityColor(track.popularity)}`}>
                      {track.popularity}%
                    </span>
                  </div>
                  <div className="w-20 bg-spotify-dark rounded-full h-1">
                    <div
                      className="bg-spotify-green h-1 rounded-full transition-all duration-300"
                      style={{ width: `${track.popularity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex-shrink-0 text-right">
                  <span className="text-spotify-gray text-sm">
                    {formatDuration(track.duration_ms)}
                  </span>
                </div>

                {/* Spotify link */}
                <div className="flex-shrink-0">
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spotify-green hover:text-green-400 transition duration-200"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tracks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay canciones disponibles
          </h3>
          <p className="text-spotify-gray">
            Intenta cambiar el período de tiempo o escucha más música para ver tus canciones favoritas
          </p>
        </div>
      )}
    </div>
  );
};

export default TopTracks;
