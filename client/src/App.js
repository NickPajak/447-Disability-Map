// main app component
import React from 'react';
import MainPage from './pages/MainPage';
import HelpButton from './components/HelpButton';
import styled from 'styled-components';


const AppContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const TopRightImage = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 125px;
  height: auto;
  pointer-events: none;
  opacity: 1;
  z-index: 1000;
`;

function App() {
    return (
      <AppContainer>
        <TopRightImage src="/assets/LOGO.png" alt="Logo" />
        <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <MainPage />
          <HelpButton />
        </div>
      </AppContainer>
    
    );
}

export default App;