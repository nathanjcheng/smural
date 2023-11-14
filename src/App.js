import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CLIENT_ID = '';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const OPENAI_API_KEY = '';
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/completions';
const DALLE_API_ENDPOINT = 'https://api.openai.com/v1/images/generations';

const DALLE_PROMPT = "Given this list of artists, "
  + "For top three artists, think of an item that relates to the artist."
  + "Create an image prompt where all the other items are in a artistic abstract mural."
  + "Don't include the names of the artists in the prompt."
  + "Only respond with the image prompt."
  + "Don't give a link to an image.";

function App() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('spotifyAccessToken', accessToken);
      setToken(accessToken);
    } else {
      const storedToken = localStorage.getItem('spotifyAccessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const handleLogin = () => {
    const scopes = 'user-top-read';
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes}&response_type=${RESPONSE_TYPE}`;
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('spotifyAccessToken');
  };

  const handleGenerateImage = async () => {
    try {
      const topArtists = await getTopArtists();

      if (topArtists.length > 0) {
        const openaiResponse = await callOpenAIAPI(topArtists);

        if (openaiResponse) {
          await callDALLEAPI(openaiResponse);
        } else {
          console.error('No OpenAI response to generate image.');
        }
      } else {
        console.error('No artists found.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const getTopArtists = async () => {
    try {
      if (!token) {
        return [];
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

      console.log('Your Top Artists:', response.data.items.map((artist) => artist.name));
      return response.data.items;
    } catch (error) {
      console.error('Error getting top artists:', error);
      return [];
    }
  };

  const callOpenAIAPI = async (topArtists) => {
    try {
      const artistNames = topArtists.map((artist) => artist.name);
      const promptWithArtists = `This is the list: (${artistNames.join(', ')}) ${DALLE_PROMPT} (Make it fit in 40 Tokens without cutting off.)`;
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          model: 'text-davinci-003',
          prompt: promptWithArtists,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('OpenAI Response:', response.data.choices[0].text.trim());
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('OPEN AI ERROR', error);
      return '';
    }
  };

  const callDALLEAPI = async (openaiResponse) => {
    try {
      const response = await axios.post(DALLE_API_ENDPOINT, {
        model: "dall-e-3",
        prompt: openaiResponse + "abstract mural",
        size: "1024x1024",
        quality: "standard",
        n: 1,
      }, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("DALL-E API Response:", response.data);

      if (response.data && response.data.data && response.data.data.length > 0) {
        const generatedImageURL = response.data.data[0].url;
        console.log("Generated Image URL:", generatedImageURL);
        setGeneratedImage(generatedImageURL);
      } else {
        console.error('No generated image URL found in the response.');
      }
    } catch (error) {
      console.error('DALL-E API Error', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smural</h1>
        {token ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleGenerateImage}>Get Top Artists and Generate Image</button>
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

        {generatedImage && (
          <div>
            <h2>Generated Image:</h2>
            <img src={generatedImage} alt="Generated by DALL-E" />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
