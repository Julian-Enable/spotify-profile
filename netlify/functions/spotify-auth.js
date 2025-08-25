const axios = require('axios');

exports.handler = async (event, context) => {
  // Habilitar CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://spotifyprofile.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, code_verifier, redirect_uri, client_id } = JSON.parse(event.body);

    if (!code || !code_verifier || !redirect_uri || !client_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Intercambiar el código por un token
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        code_verifier: code_verifier
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(tokenResponse.data)
    };

  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to exchange code for token',
        details: error.response?.data || error.message
      })
    };
  }
};
