# Mi Perfil de Spotify 🎵

Una aplicación web moderna que te permite ver tu perfil de Spotify, artistas favoritos, canciones más escuchadas y obtener recomendaciones personalizadas.

## ✨ Características

- 🔐 **Autenticación OAuth 2.0** con Spotify
- 👤 **Perfil de Usuario** con información detallada
- 🎤 **Artistas Favoritos** con estadísticas de popularidad
- 🎵 **Canciones Favoritas** del último mes, 6 meses o todo el tiempo
- 🎧 **Recomendaciones Personalizadas** basadas en tus gustos
- 📱 **Diseño Responsivo** con Tailwind CSS
- ⚡ **Interfaz Moderna** inspirada en Spotify

## 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para llamadas a la API
- **Spotify Web API** para datos musicales

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta de Spotify
- Una aplicación registrada en Spotify Developer Dashboard

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd spotify-profile
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura tu aplicación de Spotify:**
   - Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Crea una nueva aplicación
   - Anota tu `Client ID`
   - En la configuración de la app, agrega `http://localhost:3000/callback` como Redirect URI

4. **Configura las variables de entorno:**
   - Abre `src/contexts/AuthContext.tsx`
   - Reemplaza `'TU_CLIENT_ID_AQUI'` con tu Client ID real

5. **Inicia la aplicación:**
   ```bash
   npm start
   ```

6. **Abre tu navegador:**
   - Ve a `http://localhost:3000`
   - Haz clic en "Conectar con Spotify"
   - Autoriza la aplicación

## 🔧 Configuración de Spotify Developer Dashboard

### 1. Crear una Aplicación
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create App"
4. Completa la información:
   - **App name**: Mi Perfil de Spotify
   - **App description**: Aplicación para ver mi perfil musical
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/callback`
   - **API/SDKs**: Web API

### 2. Configurar Scopes
La aplicación requiere los siguientes permisos:
- `user-read-private` - Leer información del perfil
- `user-read-email` - Leer email del usuario
- `user-top-read` - Leer artistas y canciones favoritas
- `user-read-recently-played` - Leer historial reciente
- `playlist-read-private` - Leer playlists privadas
- `playlist-read-collaborative` - Leer playlists colaborativas

### 3. Obtener Client ID
1. En tu aplicación creada, copia el **Client ID**
2. Reemplázalo en `src/contexts/AuthContext.tsx`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── Login.tsx       # Página de inicio de sesión
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── UserProfile.tsx # Perfil del usuario
│   ├── TopArtists.tsx  # Artistas favoritos
│   ├── TopTracks.tsx   # Canciones favoritas
│   ├── Recommendations.tsx # Recomendaciones
│   └── Callback.tsx    # Manejo de autenticación
├── contexts/           # Contextos de React
│   └── AuthContext.tsx # Contexto de autenticación
├── services/           # Servicios
│   └── spotifyService.ts # Servicio de Spotify API
├── types/              # Tipos de TypeScript
│   └── spotify.ts      # Interfaces de Spotify
└── App.tsx             # Componente principal
```

## 🎨 Personalización

### Colores de Spotify
Los colores están definidos en `tailwind.config.js`:
- Verde Spotify: `#1DB954`
- Negro Spotify: `#191414`
- Gris Oscuro: `#121212`
- Gris Claro: `#282828`
- Gris Texto: `#B3B3B3`

### Modificar Estilos
Puedes personalizar los estilos editando:
- `src/index.css` - Estilos globales
- `tailwind.config.js` - Configuración de Tailwind
- Componentes individuales para estilos específicos

## 🔍 Funcionalidades

### 1. Perfil de Usuario
- Información personal del usuario
- Estadísticas de la cuenta
- Enlaces rápidos a Spotify

### 2. Artistas Favoritos
- Top 20 artistas más escuchados
- Filtros por período (mes, 6 meses, todo el tiempo)
- Información de popularidad y géneros
- Enlaces directos a Spotify

### 3. Canciones Favoritas
- Top 20 canciones más escuchadas
- Filtros por período
- Información del álbum y duración
- Enlaces directos a Spotify

### 4. Recomendaciones
- Selección interactiva de artistas y canciones
- Generación de recomendaciones personalizadas
- Vista previa de canciones recomendadas
- Enlaces directos para escuchar

## 🚀 Despliegue

### Para Producción
1. **Actualiza las URLs de redirección:**
   - En Spotify Developer Dashboard, agrega tu dominio de producción
   - Actualiza `REDIRECT_URI` en `AuthContext.tsx`

2. **Construye la aplicación:**
   ```bash
   npm run build
   ```

3. **Despliega en tu servidor:**
   - Sube la carpeta `build` a tu servidor web
   - Configura el servidor para servir `index.html` en todas las rutas

### Plataformas Recomendadas
- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Despliegue con drag & drop
- **GitHub Pages**: Gratuito para proyectos personales
- **Firebase Hosting**: Integración con Google Cloud

## 🐛 Solución de Problemas

### Error de Autenticación
- Verifica que el Client ID sea correcto
- Asegúrate de que la Redirect URI coincida exactamente
- Revisa que los scopes estén configurados correctamente

### No se Cargan los Datos
- Verifica que el token de acceso sea válido
- Revisa la consola del navegador para errores
- Asegúrate de tener datos de escucha en Spotify

### Problemas de Estilos
- Verifica que Tailwind CSS esté configurado correctamente
- Revisa que las clases de CSS estén aplicadas
- Limpia la caché del navegador

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
2. Consulta los issues del repositorio
3. Crea un nuevo issue con detalles del problema

## 🎉 Agradecimientos

- [Spotify](https://spotify.com) por la excelente API
- [Tailwind CSS](https://tailwindcss.com) por el framework de estilos
- [React](https://reactjs.org) por el framework de JavaScript

---

¡Disfruta explorando tu perfil musical! 🎵✨
