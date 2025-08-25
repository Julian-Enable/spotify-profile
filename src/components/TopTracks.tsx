import React, { useState, useEffect } from 'react';
import { SpotifyTrack } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

const TopTracks: React.FC = () => {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isLoading, setIsLoading] = useState(true);

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

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return '#4ade80'; // green-400
    if (popularity >= 60) return '#facc15'; // yellow-400
    if (popularity >= 40) return '#fb923c'; // orange-400
    return '#f87171'; // red-400
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: '0 0 8px 0'
          }}>
            Tus Canciones Favoritas
          </h2>
          <p style={{ color: '#B3B3B3', margin: 0 }}>
            Descubre qué canciones has estado escuchando más
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['short_term', 'medium_term', 'long_term'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                backgroundColor: timeRange === range ? '#1DB954' : '#282828',
                color: timeRange === range ? '#FFFFFF' : '#B3B3B3',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (timeRange !== range) {
                  e.currentTarget.style.backgroundColor = '#404040';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
              onMouseOut={(e) => {
                if (timeRange !== range) {
                  e.currentTarget.style.backgroundColor = '#282828';
                  e.currentTarget.style.color = '#B3B3B3';
                }
              }}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '2px solid #1DB954',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <p style={{ color: '#B3B3B3' }}>Cargando canciones...</p>
        </div>
      )}

      {/* Tracks grid */}
      {!isLoading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {tracks.map((track, index) => (
            <div
              key={track.id}
              style={{
                backgroundColor: '#282828',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #404040',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#404040';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#282828';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  backgroundColor: '#1DB954',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  zIndex: 1
                }}>
                  #{index + 1}
                </div>
                {track.album.images && track.album.images[0] ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#404040',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    🎵
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  margin: 0
                }}>
                  {track.name}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#B3B3B3',
                  margin: 0
                }}>
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                
                <p style={{
                  fontSize: '12px',
                  color: '#808080',
                  margin: 0
                }}>
                  {track.album.name}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#B3B3B3', fontSize: '14px' }}>Popularidad:</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: getPopularityColor(track.popularity)
                    }}>
                      {track.popularity}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: '60px',
                    backgroundColor: '#000000',
                    borderRadius: '10px',
                    height: '8px'
                  }}>
                    <div
                      style={{
                        backgroundColor: '#1DB954',
                        height: '8px',
                        borderRadius: '10px',
                        width: `${track.popularity}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#B3B3B3', fontSize: '14px' }}>
                    Duración: {formatDuration(track.duration_ms)}
                  </span>
                  
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#1DB954',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#1ed760';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = '#1DB954';
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🎵</span>
                    <span>Escuchar</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tracks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎵</div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: '0 0 8px 0'
          }}>
            No hay canciones disponibles
          </h3>
          <p style={{ color: '#B3B3B3' }}>
            Intenta cambiar el período de tiempo o escucha más música para ver tus canciones favoritas
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TopTracks;
