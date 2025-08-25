import axios from 'axios';
import { SpotifyUser, SpotifyTopItems, SpotifyRecommendations } from '../types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

class SpotifyService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 10): Promise<SpotifyTopItems> {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/artists`, {
      headers: this.getHeaders(),
      params: {
        time_range: timeRange,
        limit,
      },
    });
    return response.data;
  }

  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 10): Promise<SpotifyTopItems> {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/tracks`, {
      headers: this.getHeaders(),
      params: {
        time_range: timeRange,
        limit,
      },
    });
    return response.data;
  }

  async getRecommendations(seedArtists: string[] = [], seedTracks: string[] = [], limit: number = 20): Promise<SpotifyRecommendations> {
    // Limitar a máximo 5 seeds totales (Spotify API limit)
    const maxSeeds = 5;
    const totalSeeds = seedArtists.length + seedTracks.length;
    
    let finalSeedArtists = seedArtists;
    let finalSeedTracks = seedTracks;
    
    if (totalSeeds > maxSeeds) {
      // Priorizar artistas si hay demasiados seeds
      if (seedArtists.length >= maxSeeds) {
        finalSeedArtists = seedArtists.slice(0, maxSeeds);
        finalSeedTracks = [];
      } else {
        finalSeedArtists = seedArtists;
        finalSeedTracks = seedTracks.slice(0, maxSeeds - seedArtists.length);
      }
    }
    
    const params: any = {
      limit,
    };
    
    // Solo agregar parámetros si hay seeds
    if (finalSeedArtists.length > 0) {
      params.seed_artists = finalSeedArtists.join(',');
    }
    
    if (finalSeedTracks.length > 0) {
      params.seed_tracks = finalSeedTracks.join(',');
    }
    
    // Debug logging
    console.log('Spotify API Debug:', {
      url: `${SPOTIFY_API_BASE}/recommendations`,
      params,
      finalSeedArtists,
      finalSeedTracks,
      totalSeeds: finalSeedArtists.length + finalSeedTracks.length
    });
    
    const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations`, {
      headers: this.getHeaders(),
      params,
    });
    return response.data;
  }

  async getRecentlyPlayed(limit: number = 20): Promise<any> {
    const response = await axios.get(`${SPOTIFY_API_BASE}/me/player/recently-played`, {
      headers: this.getHeaders(),
      params: {
        limit,
      },
    });
    return response.data;
  }
}

export const spotifyService = new SpotifyService();
