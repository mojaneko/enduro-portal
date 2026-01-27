import { Box, Container, Typography, Stack, Divider, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Stack spacing={1.5} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsBikeIcon sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="600" color="text.primary">
                エンデューロ ポータル
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              レース情報を簡単に確認できるポータルサイト
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              component={RouterLink}
              to="privacy-policy"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              プライバシーポリシー
            </Link>
            <Link
              component={RouterLink}
              to="about-gucci-club"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              GUCCI Clubについて
            </Link>
          </Box>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()}{' '}
            <Link
              component={RouterLink}
              to=""
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              エンデューロ ポータル
            </Link>
            . Operated by GUCCI Club. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;