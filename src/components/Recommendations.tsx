import React, { useState, useEffect } from 'react';
import { SpotifyTrack, SpotifyArtist } from '../types/spotify';
import { spotifyService } from '../services/spotifyService';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [selectedSeeds, setSelectedSeeds] = useState<{ artists: string[], tracks: string[] }>({
    artists: [],
    tracks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [artistsData, tracksData] = await Promise.all([
          spotifyService.getTopArtists('medium_term', 10),
          spotifyService.getTopTracks('medium_term', 10)
        ]);
        
        setTopArtists(artistsData.items as SpotifyArtist[]);
        setTopTracks(tracksData.items as SpotifyTrack[]);
        
        // Seleccionar automáticamente los primeros 2 artistas y 1 track
        const autoSelectedArtists = artistsData.items.slice(0, 2).map((artist: SpotifyArtist) => artist.id);
        const autoSelectedTracks = tracksData.items.slice(0, 1).map((track: SpotifyTrack) => track.id);
        
        setSelectedSeeds({
          artists: autoSelectedArtists,
          tracks: autoSelectedTracks
        });
        
        // Generar recomendaciones automáticamente
        await generateRecommendations(autoSelectedArtists, autoSelectedTracks);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const generateRecommendations = async (artistIds: string[], trackIds: string[]) => {
    setIsGenerating(true);
    try {
      const seeds = [...artistIds, ...trackIds].slice(0, 5); // Máximo 5 seeds
      const data = await spotifyService.getRecommendations(seeds, 20);
      setRecommendations(data.tracks as SpotifyTrack[]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleArtist = (artistId: string) => {
    setSelectedSeeds(prev => {
      const newArtists = prev.artists.includes(artistId)
        ? prev.artists.filter(id => id !== artistId)
        : [...prev.artists, artistId].slice(0, 3); // Máximo 3 artistas
      
      return { ...prev, artists: newArtists };
    });
  };

  const toggleTrack = (trackId: string) => {
    setSelectedSeeds(prev => {
      const newTracks = prev.tracks.includes(trackId)
        ? prev.tracks.filter(id => id !== trackId)
        : [...prev.tracks, trackId].slice(0, 2); // Máximo 2 tracks
      
      return { ...prev, tracks: newTracks };
    });
  };

  const handleGenerateRecommendations = () => {
    const allSeeds = [...selectedSeeds.artists, ...selectedSeeds.tracks];
    if (allSeeds.length > 0) {
      generateRecommendations(selectedSeeds.artists, selectedSeeds.tracks);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: '0 0 8px 0'
        }}>
          Recomendaciones Personalizadas
        </h2>
        <p style={{ color: '#B3B3B3', margin: 0 }}>
          Descubre nueva música basada en tus gustos
        </p>
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
          <p style={{ color: '#B3B3B3' }}>Cargando tus datos...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Seed Selection */}
          <div style={{
            backgroundColor: '#282828',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '30px',
            border: '1px solid #404040'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              margin: '0 0 20px 0'
            }}>
              Selecciona tus favoritos para generar recomendaciones
            </h3>

            {/* Artists */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0 0 12px 0'
              }}>
                Artistas ({selectedSeeds.artists.length}/3)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {topArtists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => toggleArtist(artist.id)}
                    style={{
                      backgroundColor: selectedSeeds.artists.includes(artist.id) ? '#1DB954' : '#181818',
                      color: selectedSeeds.artists.includes(artist.id) ? '#FFFFFF' : '#B3B3B3',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      if (!selectedSeeds.artists.includes(artist.id)) {
                        e.currentTarget.style.backgroundColor = '#404040';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedSeeds.artists.includes(artist.id)) {
                        e.currentTarget.style.backgroundColor = '#181818';
                        e.currentTarget.style.color = '#B3B3B3';
                      }
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {artist.name}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {artist.genres?.slice(0, 2).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tracks */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0 0 12px 0'
              }}>
                Canciones ({selectedSeeds.tracks.length}/2)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {topTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    style={{
                      backgroundColor: selectedSeeds.tracks.includes(track.id) ? '#1DB954' : '#181818',
                      color: selectedSeeds.tracks.includes(track.id) ? '#FFFFFF' : '#B3B3B3',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      if (!selectedSeeds.tracks.includes(track.id)) {
                        e.currentTarget.style.backgroundColor = '#404040';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedSeeds.tracks.includes(track.id)) {
                        e.currentTarget.style.backgroundColor = '#181818';
                        e.currentTarget.style.color = '#B3B3B3';
                      }
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {track.name}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                      {track.artists.map(artist => artist.name).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateRecommendations}
              disabled={isGenerating || (selectedSeeds.artists.length + selectedSeeds.tracks.length) === 0}
              style={{
                backgroundColor: (selectedSeeds.artists.length + selectedSeeds.tracks.length) === 0 ? '#404040' : '#1DB954',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (selectedSeeds.artists.length + selectedSeeds.tracks.length) === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if ((selectedSeeds.artists.length + selectedSeeds.tracks.length) > 0) {
                  e.currentTarget.style.backgroundColor = '#1ed760';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if ((selectedSeeds.artists.length + selectedSeeds.tracks.length) > 0) {
                  e.currentTarget.style.backgroundColor = '#1DB954';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isGenerating ? 'Generando...' : 'Generar Recomendaciones'}
            </button>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: '0 0 20px 0'
              }}>
                Recomendaciones para ti
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {recommendations.map((track) => (
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
                    {track.album.images && track.album.images[0] ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '16px'
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
                        fontSize: '48px',
                        marginBottom: '16px'
                      }}>
                        🎵
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        margin: 0
                      }}>
                        {track.name}
                      </h4>
                      
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
                        {track.album.name} • {formatDuration(track.duration_ms)}
                      </p>
                      
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
                          transition: 'color 0.3s ease',
                          marginTop: '8px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = '#1ed760';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = '#1DB954';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🎵</span>
                        <span>Escuchar en Spotify</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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

export default Recommendations;
