import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Alert,
  Stack,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Link,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import { getRaces, formatRaceDate, getRaceStatus, formatSeriesWithRound, raceIncludesSeries, getRaceClasses } from '../data/races';
import { getSeriesColor } from '../utils/seriesColors';
import { getEntryUrl, handleDirectLink } from '../utils/siteConfig';
import { downloadICalFile } from '../utils/icalGenerator';

const ITEMS_PER_PAGE = 7;

const RaceSelectionPage = () => {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState('すべて');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showPastRaces, setShowPastRaces] = useState(false);
  const [raceEntryUrls, setRaceEntryUrls] = useState({});

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const racesData = await getRaces();
        setRaces(racesData);
        
        // 各レースのentryUrlを事前に取得
        const entryUrls = {};
        for (const race of racesData) {
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

  // シリーズの一覧を取得
  const seriesList = useMemo(() => {
    const seriesSet = new Set();
    races.forEach(race => {
      if (Array.isArray(race.series)) {
        race.series.forEach(s => seriesSet.add(s));
      } else {
        seriesSet.add(race.series);
      }
    });
    return ['すべて', ...Array.from(seriesSet)];
  }, [races]);

  // 絞り込まれたレース一覧
  const filteredRaces = useMemo(() => {
    const now = new Date();
    let filtered = races;
    
    // 終了したレースを除外（チェックボックスがOFFの場合）
    if (!showPastRaces) {
      filtered = filtered.filter(race => new Date(race.endDate) >= now);
    }
    
    // シリーズで絞り込み
    if (selectedSeries !== 'すべて') {
      filtered = filtered.filter(race => raceIncludesSeries(race, selectedSeries));
    }
    
    // startDateでソート（昇順）
    filtered = filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    return filtered;
  }, [races, selectedSeries, showPastRaces]);

  // 表示するレース一覧
  const displayedRaces = useMemo(() => {
    return filteredRaces.slice(0, displayCount);
  }, [filteredRaces, displayCount]);

  const hasMore = displayCount < filteredRaces.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredRaces.length));
  };

  const handleSeriesChange = (series) => {
    setSelectedSeries(series);
    setDisplayCount(ITEMS_PER_PAGE); // リセット
  };

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

  const handleDownloadICal = () => {
    const filterInfo = selectedSeries === 'すべて' ? '' : selectedSeries;
    const filename = selectedSeries === 'すべて' 
      ? 'enduro-races' 
      : `enduro-races-${selectedSeries.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    downloadICalFile(filteredRaces, filename, filterInfo);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          レース一覧
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          エンデューロレースの情報を確認できます
        </Typography>
      </Box>

      {/* シリーズ絞り込みタグ */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
            シリーズで絞り込み
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {filteredRaces.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadICal}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                }}
              >
                カレンダー ({filteredRaces.length}件)
              </Button>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPastRaces}
                  onChange={(e) => setShowPastRaces(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  終了した大会を表示
                </Typography>
              }
            />
          </Box>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {seriesList.map((series) => {
            const seriesColor = series === 'すべて' ? null : getSeriesColor(series);
            const isSelected = selectedSeries === series;
            
            return (
              <Chip
                key={series}
                label={series}
                onClick={() => handleSeriesChange(series)}
                sx={{
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.9rem',
                  px: 1,
                  height: 36,
                  transition: 'all 0.2s ease',
                  ...(series === 'すべて' ? {
                    bgcolor: isSelected ? 'primary.main' : 'grey.200',
                    color: isSelected ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'grey.300',
                    },
                  } : {
                    bgcolor: isSelected ? seriesColor.main : 'white',
                    color: isSelected ? 'white' : seriesColor.main,
                    border: `2px solid ${seriesColor.main}`,
                    '&:hover': {
                      bgcolor: isSelected ? seriesColor.dark : seriesColor.light,
                      color: isSelected ? 'white' : seriesColor.main,
                    },
                  }),
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Grid container spacing={3}>
        {displayedRaces.map((race) => {
          const raceStatus = getRaceStatus(race);
          const primarySeries = Array.isArray(race.series) ? race.series[0] : race.series;
          const seriesColor = getSeriesColor(primarySeries);
          const now = new Date();

          return (
            <Grid item xs={12} key={race.raceId}>
              <Card
                elevation={3}
                sx={{
                  opacity: raceStatus.isAvailable ? 1 : 0.7,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* シリーズバッジ */}
                    <Grid item xs={12} sm={2} md={1} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center' } }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          background: Array.isArray(race.series) && race.series.length > 1
                            ? `linear-gradient(135deg, ${seriesColor.main} 0%, ${seriesColor.main} 50%, ${getSeriesColor(race.series[1]).main} 50%, ${getSeriesColor(race.series[1]).main} 100%)`
                            : seriesColor.main,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          textAlign: 'center',
                          px: 0.5,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                          lineHeight: 1.2,
                        }}
                      >
                        {formatSeriesWithRound(race)}
                      </Box>
                    </Grid>

                    {/* レース情報 */}
                    <Grid item xs={12} sm={10} md={7}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {race.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {(() => {
                          const classes = getRaceClasses(race);
                          
                          // classesが空の場合は何も表示しない
                          if (classes.official.length === 0 && classes.approved.length === 0) {
                            return null;
                          }
                          
                          return (
                            <>
                              {classes.official.length > 0 && (
                                <>
                                  <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                    公認：
                                  </Typography>
                                  {classes.official.map((cls) => (
                                    <Chip
                                      key={cls}
                                      label={cls}
                                      size="small"
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ))}
                                </>
                              )}
                              {classes.approved.length > 0 && (
                                <>
                                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mr: 0.5 }}>
                                    承認：
                                  </Typography>
                                  {classes.approved.map((cls) => (
                                    <Chip
                                      key={cls}
                                      label={cls}
                                      size="small"
                                      color="secondary"
                                      variant="outlined"
                                    />
                                  ))}
                                </>
                              )}
                            </>
                          );
                        })()}
                      </Box>
                    </Grid>

                    {/* アクションエリア */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {raceStatus.type === 'past' ? (
                          <Alert severity="info" sx={{ py: 0.5 }}>
                            このレースは終了しました
                          </Alert>
                        ) : raceStatus.type === 'closed' ? (
                          <Alert severity="error" sx={{ py: 0.5 }}>
                            エントリー締切済み
                          </Alert>
                        ) : raceStatus.type === 'undetermined' ? (
                          <Alert severity="warning" sx={{ py: 0.5 }}>
                            エントリー開始日未定
                          </Alert>
                        ) : raceStatus.type === 'upcoming' ? (
                          <Alert severity="warning" sx={{ py: 0.5 }}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              エントリー開始まであと{raceStatus.daysUntil}日
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              エントリー開始: {race.entryStartDate && race.entryStartDate !== "" ? new Date(race.entryStartDate).toLocaleDateString('ja-JP') : 'エントリー開始日未定'}
                            </Typography>
                          </Alert>
                        ) : raceStatus.type === 'available' ? (
                          <Alert severity="success" sx={{ py: 0.5 }}>
                            <Typography 
                              variant="body2"
                              sx={{ 
                                color: now > raceStatus.deadline ? 'error.main' : 'inherit',
                                fontWeight: now > raceStatus.deadline ? 600 : 400
                              }}
                            >
                              エントリー締切: {raceStatus.deadline.toLocaleDateString('ja-JP')}
                            </Typography>
                          </Alert>
                        ) : null}

                        {raceEntryUrls[race.raceId] && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={() => handleRaceSelect(race)}
                            startIcon={race.entryUrl ? <OpenInNewIcon /> : null}
                            sx={{ minHeight: 48 }}
                          >
                            {race.entryUrl ? '外部サイトで確認' : 'レース詳細を見る'}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      )}

      {/* さらに表示するボタン */}
      {hasMore && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleLoadMore}
            endIcon={<ExpandMoreIcon />}
            sx={{
              minWidth: 200,
              borderRadius: 2,
              py: 1.5,
            }}
          >
            さらに表示する ({filteredRaces.length - displayCount}件)
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          onClick={() => navigate('/')}
          variant="outlined"
          color="primary"
          size="large"
        >
          ホームに戻る
        </Button>
      </Box>
    </Container>
  );
};

export default RaceSelectionPage;