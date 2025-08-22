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
    const response = await axios.get(`${SPOTIFY_API_BASE}/recommendations`, {
      headers: this.getHeaders(),
      params: {
        seed_artists: seedArtists.join(','),
        seed_tracks: seedTracks.join(','),
        limit,
      },
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
