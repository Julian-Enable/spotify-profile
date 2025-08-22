import React from 'react';
import { SpotifyUser } from '../types/spotify';

interface UserProfileProps {
  user: SpotifyUser | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="text-center text-spotify-gray">
        No se pudo cargar el perfil del usuario
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del perfil */}
      <div className="bg-spotify-light rounded-lg p-8">
        <div className="flex items-center space-x-6">
          {user.images && user.images[0] ? (
            <img
              src={user.images[0].url}
              alt={user.display_name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 bg-spotify-gray rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-spotify-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.display_name}
            </h1>
            <p className="text-spotify-gray text-lg mb-4">
              {user.email}
            </p>
            <div className="flex items-center space-x-4 text-sm text-spotify-gray">
              <span>País: {user.country}</span>
              <span>•</span>
              <span>Tipo de cuenta: {user.product}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-spotify-green text-white px-4 py-2 rounded-full text-sm font-medium">
              Usuario Verificado
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-spotify-light rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-spotify-green mb-2">
            🎵
          </div>
          <h3 className="text-white font-semibold mb-1">Perfil Activo</h3>
          <p className="text-spotify-gray text-sm">
            Tu cuenta está conectada y lista para mostrar tus datos
          </p>
        </div>
        
        <div className="bg-spotify-light rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-spotify-green mb-2">
            📊
          </div>
          <h3 className="text-white font-semibold mb-1">Datos Disponibles</h3>
          <p className="text-spotify-gray text-sm">
            Acceso completo a tu historial de escucha
          </p>
        </div>
        
        <div className="bg-spotify-light rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-spotify-green mb-2">
            🎧
          </div>
          <h3 className="text-white font-semibold mb-1">Recomendaciones</h3>
          <p className="text-spotify-gray text-sm">
            Descubre nueva música basada en tus gustos
          </p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-spotify-light rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Información de la Cuenta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-spotify-gray text-sm font-medium mb-1">
              ID de Usuario
            </label>
            <p className="text-white font-mono text-sm bg-spotify-dark px-3 py-2 rounded">
              {user.id}
            </p>
          </div>
          
          <div>
            <label className="block text-spotify-gray text-sm font-medium mb-1">
              URI de Spotify
            </label>
            <p className="text-white font-mono text-sm bg-spotify-dark px-3 py-2 rounded">
              {user.uri}
            </p>
          </div>
          
          <div>
            <label className="block text-spotify-gray text-sm font-medium mb-1">
              Tipo de Usuario
            </label>
            <p className="text-white capitalize">
              {user.type}
            </p>
          </div>
          
          <div>
            <label className="block text-spotify-gray text-sm font-medium mb-1">
              Producto
            </label>
            <p className="text-white capitalize">
              {user.product}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-spotify-light rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://open.spotify.com/user"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-spotify-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Abrir Spotify</span>
          </a>
          
          <a
            href="https://www.spotify.com/account/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-spotify-light hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
