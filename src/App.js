import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLIENT_ID = 'a791dd921e874a8480677038c38b2d60'; // Replace with your Spotify client ID
const REDIRECT_URI = 'http://localhost:3000'; // Replace with your redirect URI
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const OPENAI_API_KEY = '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'; // Replace with your OpenAI API key
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/completions';

function App() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [openaiResponse, setOpenaiResponse] = useState('');

  useEffect(() => {
    // Check if a Spotify access token is in the URL hash on page load
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      // Store the access token in local storage for later use
      localStorage.setItem('spotifyAccessToken', accessToken);
      setToken(accessToken);
    } else {
      // Check if an access token is stored in local storage
      const storedToken = localStorage.getItem('spotifyAccessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const handleLogin = () => {
    // Redirect the user to Spotify login with the required scopes
    const scopes = 'user-top-read';
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&response_type=${RESPONSE_TYPE}`;
  };

  const handleLogout = () => {
    // Clear the token from state and local storage
    setToken(null);
    localStorage.removeItem('spotifyAccessToken');
  };

  const getTopArtists = async () => {
    try {
      if (!token) {
        // Handle authentication error or prompt the user to log in
        return;
      }

      const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_range: 'long_term',
          limit: 10,
        },
      });
      setArtists(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      console.error('Error getting top artists:', error);
    }
  };

  const callOpenAIAPI = async () => {
    try {
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          model: 'text-davinci-003', // Specify the model
          prompt: prompt + "(In 50 Tokens)",
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(prompt)
      console.log(openaiResponse)
      if (response.status === 200) {
        setOpenaiResponse(response.data.choices[0].text.trim());
      } else {
        console.error('OpenAI API returned an error:', response.data);
      }
    } catch (error) {
      console.error('OPEN AI ERROR ERROR ERROR', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {token ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={getTopArtists}>Get Top Artists</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login to Spotify</button>
        )}

        {artists.length > 0 && (
          <div>
            <h2>Your Top Artists:</h2>
            <ul>
              {artists.map((artist) => (
                <li key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your OpenAI prompt here"
            cols={50}
            rows={10}
          />
          <button onClick={callOpenAIAPI}>Call OpenAI API</button>
        </div>

        {openaiResponse && (
          <div>
            <h2>OpenAI Response:</h2>
            <p>{openaiResponse}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
