import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import TopArtists from './TopArtists';
import TopTracks from './TopTracks';
import Recommendations from './Recommendations';

type TabType = 'profile' | 'artists' | 'tracks' | 'recommendations';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
    { id: 'artists', label: 'Artistas Favoritos', icon: '🎤' },
    { id: 'tracks', label: 'Canciones Favoritas', icon: '🎵' },
    { id: 'recommendations', label: 'Recomendaciones', icon: '🎧' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'artists':
        return <TopArtists />;
      case 'tracks':
        return <TopTracks />;
      case 'recommendations':
        return <Recommendations />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#121212',
      color: '#FFFFFF'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#282828',
        padding: '20px 0',
        borderBottom: '1px solid #404040',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#1DB954',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎵
            </div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1DB954, #1ed760)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Mi Perfil de Spotify
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#B3B3B3' }}>
              Hola, {user?.display_name || 'Usuario'}
            </span>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#1DB954',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1ed760';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1DB954';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        backgroundColor: '#181818',
        borderBottom: '1px solid #404040',
        padding: '0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '5px',
            padding: '10px 0'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  backgroundColor: activeTab === tab.id ? '#1DB954' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : '#B3B3B3',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#282828';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#B3B3B3';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
