import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
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
        <p style={{ color: '#B3B3B3' }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header del perfil */}
      <div style={{
        backgroundColor: '#282828',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid #404040'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          marginBottom: '25px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #1DB954',
            boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
          }}>
            {user.images && user.images[0] ? (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1DB954',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#FFFFFF'
              }}>
                👤
              </div>
            )}
          </div>

          {/* Información del usuario */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
              color: '#FFFFFF'
            }}>
              {user.display_name}
            </h1>
            
            <p style={{
              fontSize: '16px',
              color: '#B3B3B3',
              margin: '0 0 15px 0'
            }}>
              {user.email}
            </p>

            {/* Badge de verificación */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1DB954',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              <span>✓</span>
              Usuario Verificado
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '25px'
        }}>
          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #404040'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1DB954',
              marginBottom: '8px'
            }}>
              🎵
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '4px' }}>
              Perfil Activo
            </div>
            <div style={{ color: '#B3B3B3', fontSize: '14px' }}>
              Tu cuenta está conectada y lista para mostrar tus datos
            </div>
          </div>

          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #404040'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1DB954',
              marginBottom: '8px'
            }}>
              📊
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '4px' }}>
              Datos Disponibles
            </div>
            <div style={{ color: '#B3B3B3', fontSize: '14px' }}>
              Acceso completo a tu historial de escucha
            </div>
          </div>

          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #404040'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1DB954',
              marginBottom: '8px'
            }}>
              🎧
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '4px' }}>
              Recomendaciones
            </div>
            <div style={{ color: '#B3B3B3', fontSize: '14px' }}>
              Descubre nueva música basada en tus gustos
            </div>
          </div>
        </div>
      </div>

      {/* Información detallada */}
      <div style={{
        backgroundColor: '#282828',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        border: '1px solid #404040'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 25px 0',
          color: '#FFFFFF',
          borderBottom: '2px solid #1DB954',
          paddingBottom: '10px'
        }}>
          Información de la Cuenta
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #404040'
          }}>
            <div style={{
              color: '#B3B3B3',
              fontSize: '14px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ID de Usuario
            </div>
            <div style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              backgroundColor: '#000000',
              padding: '8px 12px',
              borderRadius: '5px',
              wordBreak: 'break-all'
            }}>
              {user.id}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #404040'
          }}>
            <div style={{
              color: '#B3B3B3',
              fontSize: '14px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              País
            </div>
            <div style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              {user.country || 'No especificado'}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #404040'
          }}>
            <div style={{
              color: '#B3B3B3',
              fontSize: '14px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Tipo de Cuenta
            </div>
            <div style={{
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              {user.product === 'premium' ? 'Premium' : 'Gratuita'}
            </div>
          </div>

          <div style={{
            backgroundColor: '#181818',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #404040'
          }}>
            <div style={{
              color: '#B3B3B3',
              fontSize: '14px',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              URI de Spotify
            </div>
            <div style={{
              color: '#1DB954',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              backgroundColor: '#000000',
              padding: '8px 12px',
              borderRadius: '5px',
              wordBreak: 'break-all'
            }}>
              {user.uri}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
