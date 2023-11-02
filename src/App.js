import logo from './logo.svg';
import React from 'react';
import { useEffect, useState } from 'react';

import './App.css';

function App() {

  //SPOTIFY CONSTANTS
  const CLIENT_ID = "7a2ddff09e4a43869b24d7e78c2cd9a4"
  const REDIRECT_URI = "https://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  //SPOTIFY CONSTANTS

    const [token, setToken] = useState()


  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_url=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
        Login to Spotify! </a>
      </header>
    </div>
  );
}

export default App;
