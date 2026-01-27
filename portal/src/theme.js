import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // ヘッダーグラデーションの開始色
      light: '#8fa4f3',
      dark: '#4a5bb8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2', // ヘッダーグラデーションの終了色
      light: '#9a6bc4',
      dark: '#533471',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#2c3e50', // 濃いグレー系で読みやすさを重視
      secondary: '#5a6c7d', // 中間のグレー
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    grey: {
      50: '#f8f9fa',
      100: '#e9ecef',
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: '#212529',
      900: '#1a1d20',
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h4: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    body1: {
      color: '#2c3e50',
    },
    body2: {
      color: '#5a6c7d',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a72e3 0%, #6a4291 100%)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#667eea',
          color: '#667eea',
          '&:hover': {
            borderColor: '#5a72e3',
            backgroundColor: 'rgba(102, 126, 234, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;