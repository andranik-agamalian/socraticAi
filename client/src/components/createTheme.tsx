import { createTheme } from '@mui/material/styles';

// Extend the Palette interface to include a gradient property
declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      background: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      background: string;
    };
  }
}

// Light theme with gradients
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2953A6',
    },
    background: {
      paper: '#cccccc',
    },
    gradient: {
      background: 'linear-gradient(135deg, #1E2D59, #442975)',
    },
  },
});

// Dark theme with gradients
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    gradient: {
      background: 'linear-gradient(135deg, #141E30, #243B55)',
    },
  },
});

export { lightTheme, darkTheme };
