import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RaceSelectionPage from './pages/RaceSelectionPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/races"
          element={
            <>
              <Header />
              <RaceSelectionPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <>
              <Header />
              <PrivacyPolicyPage />
              <Footer />
            </>
          }
        />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </Box>
  );
}

export default App;