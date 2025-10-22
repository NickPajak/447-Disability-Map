// main app component
import React from 'react';
import MainPage from './pages/MainPage';
import HelpButton from "./components/HelpButton";

function App() {
    return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Accessibility Navigation</h2>
      <MainPage />
      <HelpButton />
    </div>
    );
}

export default App;