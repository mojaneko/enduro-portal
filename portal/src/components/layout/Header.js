import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* ポータルロゴ */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            cursor: 'pointer',
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} component="div" sx={{ fontWeight: 700 }}>
            エンデューロ ポータル
          </Typography>
        </Box>

        {/* 右側のコンテンツ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="inherit" sx={{ mr: 1, display: { xs: 'none', md: 'block' } }}>
            レース情報サイト
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;