// main app component
import {React, useState} from 'react';
import MainPage from './pages/MainPage';
import HelpButton from './components/HelpButton';
import {styled, ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme} from './styles/theme';



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
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(prev => !prev);
    return (
      <ThemeProvider theme={darkMode ? darkTheme: lightTheme}>
        <AppContainer>
          <TopRightImage src="/assets/LOGO.png" alt="Logo" />
          <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <MainPage darkMode={darkMode}/>
            <HelpButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </AppContainer>
      </ThemeProvider>
    
    );
}

export default App;