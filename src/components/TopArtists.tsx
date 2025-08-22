import React, { useState, useEffect } from 'react';
import { SpotifyArtist } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

interface TopArtistsProps {
  artists: SpotifyArtist[];
}

const TopArtists: React.FC<TopArtistsProps> = ({ artists: initialArtists }) => {
  const [artists, setArtists] = useState<SpotifyArtist[]>(initialArtists);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isLoading, setIsLoading] = useState(false);

  const timeRangeLabels = {
    short_term: 'Último mes',
    medium_term: 'Últimos 6 meses',
    long_term: 'Todo el tiempo'
  };

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const data = await spotifyService.getTopArtists(timeRange, 20);
        setArtists(data.items as SpotifyArtist[]);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [timeRange]);

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
            Tus Artistas Favoritos
          </h2>
          <p className="text-spotify-gray">
            Descubre qué artistas has estado escuchando más
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
          <p className="text-spotify-gray">Cargando artistas...</p>
        </div>
      )}

      {/* Artists grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="bg-spotify-light rounded-lg p-6 hover:bg-gray-700 transition duration-200 group"
            >
              <div className="relative mb-4">
                <div className="absolute top-2 left-2 bg-spotify-green text-white text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 1}
                </div>
                {artist.images && artist.images[0] ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition duration-200"
                  />
                ) : (
                  <div className="w-full h-48 bg-spotify-gray rounded-lg flex items-center justify-center">
                    <svg className="h-16 w-16 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-spotify-green transition duration-200">
                  {artist.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-spotify-gray text-sm">Popularidad:</span>
                    <span className={`text-sm font-medium ${getPopularityColor(artist.popularity)}`}>
                      {artist.popularity}%
                    </span>
                  </div>
                  
                  <div className="w-16 bg-spotify-dark rounded-full h-2">
                    <div
                      className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${artist.popularity}%` }}
                    ></div>
                  </div>
                </div>
                
                {artist.genres && artist.genres.length > 0 && (
                  <div>
                    <p className="text-spotify-gray text-sm mb-1">Géneros:</p>
                    <div className="flex flex-wrap gap-1">
                      {artist.genres.slice(0, 3).map((genre, idx) => (
                        <span
                          key={idx}
                          className="bg-spotify-dark text-spotify-gray text-xs px-2 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                      {artist.genres.length > 3 && (
                        <span className="text-spotify-gray text-xs">+{artist.genres.length - 3} más</span>
                      )}
                    </div>
                  </div>
                )}
                
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-spotify-green hover:text-green-400 text-sm font-medium transition duration-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  <span>Ver en Spotify</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && artists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No hay artistas disponibles
          </h3>
          <p className="text-spotify-gray">
            Intenta cambiar el período de tiempo o escucha más música para ver tus artistas favoritos
          </p>
        </div>
      )}
    </div>
  );
};

export default TopArtists;
