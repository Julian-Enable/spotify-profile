# 🎵 Configuración de Spotify Developer Dashboard

## 📋 Pasos para configurar tu aplicación Spotify:

### 1. **Ve a Spotify Developer Dashboard**
- Abre: https://developer.spotify.com/dashboard
- Inicia sesión con tu cuenta de Spotify

### 2. **Crea una nueva aplicación**
- Haz clic en "Create App"
- **App name**: `Mi Perfil de Spotify` (o el nombre que quieras)
- **App description**: `Aplicación web para ver mi perfil de Spotify`
- **Website**: `https://spotifyprofile.netlify.app`
- **Redirect URIs**: `https://spotifyprofile.netlify.app/callback`
- **API/SDKs**: Marca "Web API"
- Haz clic en "Save"

### 3. **Configura los Redirect URIs**
- En tu app, ve a "Edit Settings"
- En "Redirect URIs" agrega:
  ```
  https://spotifyprofile.netlify.app/callback
  ```
- Haz clic en "Save"

### 4. **Copia tu Client ID**
- En la página principal de tu app, copia el "Client ID"
- Reemplaza `6a33f98b08844547828ddcd86394c8ce` con tu Client ID real

### 5. **Verifica los scopes**
- Los scopes que estamos usando son:
  - `user-read-private`
  - `user-read-email` 
  - `user-top-read`
- Estos scopes están disponibles para aplicaciones web

## 🚨 **Importante:**
- **NO uses Implicit Flow** - Spotify lo desaconseja para aplicaciones web
- **Usa Authorization Code Flow** con PKCE
- **Asegúrate de que el Redirect URI coincida exactamente**

## 🔄 **Si sigues teniendo problemas:**
1. Verifica que el Client ID sea correcto
2. Verifica que el Redirect URI esté exactamente igual
3. Asegúrate de que la app esté guardada en Spotify Dashboard
4. Prueba con un navegador en modo incógnito
