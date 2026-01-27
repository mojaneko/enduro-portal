import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import BugReportIcon from '@mui/icons-material/BugReport';
import { getUpcomingAvailableRaces } from '../data/races';
import { getEntryUrl, handleDirectLink } from '../utils/siteConfig';
import HomeRaceCard from '../components/HomeRaceCard';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [upcomingRaces, setUpcomingRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [raceEntryUrls, setRaceEntryUrls] = useState({});

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const races = await getUpcomingAvailableRaces();
        setUpcomingRaces(races);
        
        // 各レースのentryUrlを事前に取得
        const entryUrls = {};
        for (const race of races) {
          entryUrls[race.raceId] = await getEntryUrl(race);
        }
        setRaceEntryUrls(entryUrls);
      } catch (error) {
        console.error('レースデータの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // 直リンク処理
    handleDirectLink();
    
    loadRaces();
  }, []);

  const handleRaceSelect = (race) => {
    // 事前計算済みのentryUrlを使用
    const entryUrl = raceEntryUrls[race.raceId];
    
    // entryUrlがnullの場合は何もしない（ボタンが表示されないはず）
    if (!entryUrl) {
      return;
    }
    
    // formTemplateなしの外部サイトは別タブで開く
    if (!race.formTemplate && race.entryUrl) {
      window.open(entryUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // formTemplateありのエントリーサイトは同一タブで遷移
    window.location.href = entryUrl;
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white', minHeight: 'calc(100vh - 200px)' }}>
      {/* モバイル時のみ表示する控えめなヒーローセクション */}
      {isMobile && (
        <Box sx={{ pt: 2, pb: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Button
                component={RouterLink}
                to="races"
                variant="contained"
                size="medium"
                fullWidth
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  maxWidth: '280px',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                レース一覧を見る
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* 直近のレース情報 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : upcomingRaces.length > 0 && (
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h2"
              gutterBottom
              align="center"
              sx={{ mb: { xs: 3, md: 4 }, fontWeight: 600 }}
            >
              直近のレース
            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
              {upcomingRaces.map((race) => (
                <HomeRaceCard
                  key={race.raceId}
                  race={race}
                  raceEntryUrls={raceEntryUrls}
                  onRaceSelect={handleRaceSelect}
                  isMobile={isMobile}
                />
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="races"
                variant="outlined"
                color="primary"
                size="large"
              >
                すべてのレースを表示
              </Button>
            </Box>
          </Box>
        )}

        {/* このサイトについて */}
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: { xs: 3, md: 4 }, fontWeight: 600 }}
        >
          このサイトについて
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: isMobile ? 'none' : 'translateY(-4px)' },
                mx: { xs: 0, sm: 'auto' },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, md: 3 },
                }}
              >
                <InfoIcon color="primary" sx={{ fontSize: { xs: 48, md: 60 }, mb: { xs: 1, md: 2 } }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  サイト概要
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  全国のエンデューロレース情報を一覧で確認できるポータルサイトです。GUCCI Clubが運営しています。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: isMobile ? 'none' : 'translateY(-4px)' },
                mx: { xs: 0, sm: 'auto' },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                  p: { xs: 2, md: 3 },
                }}
              >
                <BugReportIcon color="primary" sx={{ fontSize: { xs: 48, md: 60 }, mb: { xs: 1, md: 2 } }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  レース情報の追加
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  掲載の希望や、掲載内容の誤りに関してはGitHubのIssueでお知らせください。
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  href="https://github.com/mojaneko/enduro-portal/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Issue を起票する
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default HomePage;