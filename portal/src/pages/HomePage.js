import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Chip,
  CircularProgress,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getUpcomingAvailableRaces, formatRaceDate, getRaceStatus, formatSeriesWithRound } from '../data/races';
import { getSeriesColor } from '../utils/seriesColors';
import { getEntryUrl, handleDirectLink } from '../utils/siteConfig';

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

  const handleRaceSelect = async (race) => {
    // Entry側に遷移
    const entryUrl = await getEntryUrl(race);
    
    // entryUrlがnullの場合は何もしない（ボタンが表示されないはず）
    if (!entryUrl) {
      return;
    }
    
    if (race.entryUrl) {
      // 外部サイトは別タブで開く
      window.open(entryUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Entry側に遷移
    window.location.href = entryUrl;
  };

  return (
    <Box sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* ヒーローセクション */}
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            backgroundColor: 'primary.main',
            color: '#fff',
            mb: { xs: 3, md: 4 },
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: { xs: 1, md: 2 },
            p: { xs: 2, sm: 3, md: 6 },
          }}
        >
          <Box sx={{ maxWidth: { md: '50%' } }}>
            <Typography
              component="h1"
              variant={isMobile ? 'h4' : 'h3'}
              color="inherit"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              エンデューロ ポータル
            </Typography>
            <Typography variant={isMobile ? 'body1' : 'h5'} color="inherit" paragraph sx={{ mb: { xs: 2, md: 3 } }}>
              レース情報を簡単に確認できるポータルサイト
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 2 },
                mt: { xs: 2, md: 2 },
              }}
            >
              <Button
                component={RouterLink}
                to="races"
                variant="contained"
                color="secondary"
                size="large"
                fullWidth={isMobile}
                sx={{
                  minHeight: { xs: '48px', sm: '44px' },
                  fontSize: { xs: '1rem', sm: '0.875rem' },
                }}
              >
                レース一覧を見る
              </Button>
            </Box>
          </Box>
        </Paper>

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

            <Grid container spacing={{ xs: 2, md: 3 }}>
              {upcomingRaces.map((race) => {
                const raceStatus = getRaceStatus(race);
                const primarySeries = Array.isArray(race.series) ? race.series[0] : race.series;
                const seriesColor = getSeriesColor(primarySeries);
                
                return (
                  <Grid item xs={12} md={4} key={race.raceId} sx={{ display: 'flex' }}>
                    <Card
                      elevation={3}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: isMobile ? 'none' : 'translateY(-4px)' },
                      }}
                    >
                      <CardContent sx={{ 
                        p: { xs: 2, md: 3 },
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        '&:last-child': { pb: { xs: 2, md: 3 } }
                      }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Chip
                            label={formatSeriesWithRound(race)}
                            sx={{ 
                              fontWeight: 'bold',
                              backgroundColor: seriesColor.main,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: seriesColor.dark,
                              }
                            }}
                            size="small"
                          />
                          {raceStatus.isAvailable && (
                            <Chip
                              label="エントリー受付中"
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>

                        {/* 上部コンテンツ */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, minHeight: 48 }}>
                            {race.name}
                          </Typography>

                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <EventIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {formatRaceDate(race.startDate, race.endDate)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnIcon fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                <Link
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(race.address && race.address.trim() ? race.address : race.venue)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                  color="inherit"
                                  sx={{ cursor: 'pointer' }}
                                >
                                  {race.venue}
                                </Link>（{race.location}）
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* ボタンは常に下部 */}
                        {raceEntryUrls[race.raceId] && (
                          <Button
                            variant={raceStatus.isAvailable ? 'contained' : 'outlined'}
                            color="primary"
                            fullWidth
                            onClick={() => handleRaceSelect(race)}
                            sx={{ mt: 2 }}
                          >
                            {race.entryUrl ? '外部サイトでエントリー' : 'レース詳細を見る'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                component={RouterLink}
                to="races"
                variant="outlined"
                color="primary"
                size="large"
              >
                全てのレースを見る
              </Button>
            </Box>
          </Box>
        )}

        {/* 特徴セクション */}
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: { xs: 3, md: 4 }, fontWeight: 600 }}
        >
          ポータルサイトの特徴
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
          <Grid item xs={12} md={4}>
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
                <DirectionsBikeIcon color="primary" sx={{ fontSize: { xs: 48, md: 60 }, mb: { xs: 1, md: 2 } }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  レース情報
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  全国のエンデューロレース情報を一覧で確認できます。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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
                <SecurityIcon color="primary" sx={{ fontSize: { xs: 48, md: 60 }, mb: { xs: 1, md: 2 } }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  簡単アクセス
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  レース詳細から直接エントリーサイトにアクセスできます。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
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
                <SpeedIcon color="primary" sx={{ fontSize: { xs: 48, md: 60 }, mb: { xs: 1, md: 2 } }} />
                <Typography variant={isMobile ? 'h6' : 'h5'} component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  最新情報
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  エントリー状況や開催情報を常に最新の状態で提供します。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default HomePage;