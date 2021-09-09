import React, { useEffect, useState } from 'react';
import './App.css';
import Details from './Details';

function App() {
  useEffect(async () => {
    const identity = 'ananya';
    const room = 'room-1';
    const res = await fetch(`/api/video-token/${identity}/${room}`);
    const data = await res.json();

    console.log(data);
  }, []);

  return <div className='App'></div>;
}

export default App;
