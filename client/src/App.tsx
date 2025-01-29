import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './components/createTheme';

// MUI Components & Icons
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// components
import ChatUI from 'components/chatPage';
import OpenSummary from './components/summary/summary';

import './App.styles.css';

// Generate or retrieve a unique session ID
const getSessionId = (): string => {
  let sessionId: string | null = localStorage.getItem('sessionId');
  
  if (!sessionId || sessionId === 'null') {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const sessionId = getSessionId();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle between light/dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <GradientBackground>
      <div style={{ width: "100%",  margin: '20px', position: 'relative' }}>
        {/* Icon Button to Toggle Dark/Light Mode */}
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <OpenSummary sessionId={sessionId}/>
        <ChatUI sessionId={sessionId} />
      </div>
      </GradientBackground>
    </ThemeProvider>
  );
}

// Gradient Background Wrapper
const GradientBackground = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme(); // Access the current theme

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.palette.gradient.background, // Use the gradient from the theme
        color: theme.palette.text.primary, // Ensure text is readable
        padding: '20px',
      }}
    >
      {children}
    </div>
  );
};

export default App;
