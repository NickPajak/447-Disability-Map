// main app component
import {React, useState} from 'react';
import MainPage from './pages/MainPage';
import HelpButton from './components/HelpButton';
import {styled, ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme} from './styles/theme';
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Reset margins/padding for entire page */
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.routePlannerBg || "#fff"}; /* replace with your bg */
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;



const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  height: auto;

  overflow-x: hidden;
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

  @media (max-width: 600px) {
    width: 80px;
    top: 5px;
    right: 5px;
  }
`;

// Wrapper for app content
const ContentWrapper = styled.div`
  font-family: sans-serif;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;


  @media (max-width: 600px) {
    padding: 1rem;
  }

  /* NEW - remove default browser margins */
  width: 100%;
  margin: 0;
`;


function App() {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => setDarkMode(prev => !prev);
    return (
      <ThemeProvider theme={darkMode ? darkTheme: lightTheme}>
        <GlobalStyle />
        <AppContainer>
          <TopRightImage src="/assets/LOGO.png" alt="Logo" />

          <ContentWrapper>
            <MainPage darkMode={darkMode}/>
            <HelpButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </ContentWrapper>
        </AppContainer>
      </ThemeProvider>
    
    );
}

export default App;