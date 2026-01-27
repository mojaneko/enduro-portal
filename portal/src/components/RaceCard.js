import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Alert,
  Link,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatRaceDate, getRaceStatus, formatSeriesWithRound, getRaceClasses } from '../data/races';
import { getSeriesColor } from '../utils/seriesColors';
import { styles, getRaceCardStyle, getSeriesBadgeBackground } from '../pages/RaceSelectionPage.styles';

const RaceCard = ({ race, raceEntryUrls, onRaceSelect }) => {
  const raceStatus = getRaceStatus(race);
  const primarySeries = Array.isArray(race.series) ? race.series[0] : race.series;
  const seriesColor = getSeriesColor(primarySeries);
  const now = new Date();

  return (
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card elevation={3} sx={getRaceCardStyle(raceStatus)}>
        <CardContent sx={styles.raceCardContent}>
          <Grid container spacing={2} alignItems="center">
            {/* シリーズバッジ */}
            <Grid item xs={12} sm={2} md={1} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center' } }}>
              <Box
                sx={{
                  ...styles.seriesBadge,
                  background: getSeriesBadgeBackground(race, seriesColor, getSeriesColor),
                }}
              >
                {formatSeriesWithRound(race)}
              </Box>
            </Grid>

            {/* レース情報 */}
            <Grid item xs={12} sm={10} md={7}>
              <Typography {...styles.raceTitle}>
                {race.name}
              </Typography>
              
              <Box sx={styles.raceInfoContainer}>
                <Box sx={styles.raceInfoItem}>
                  <EventIcon fontSize="small" color="action" />
                  <Typography {...styles.raceInfoText}>
                    {formatRaceDate(race.startDate, race.endDate)}
                  </Typography>
                </Box>
                <Box sx={styles.raceInfoItem}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography {...styles.raceInfoText}>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(race.address && race.address.trim() ? race.address : race.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={styles.venueLink}
                    >
                      {race.venue}
                    </Link>（{race.location}）
                  </Typography>
                </Box>
              </Box>

              <Box sx={styles.classesContainer}>
                {(() => {
                  const classes = getRaceClasses(race);
                  
                  if (classes.official.length === 0 && classes.approved.length === 0) {
                    return null;
                  }
                  
                  return (
                    <>
                      {classes.official.length > 0 && (
                        <>
                          <Typography {...styles.classLabel}>
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
                          <Typography {...styles.classLabel} sx={{ ml: 1 }}>
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
              <Box sx={styles.actionArea}>
                {raceStatus.type === 'past' ? (
                  <Alert severity="info" sx={styles.alert}>
                    このレースは終了しました
                  </Alert>
                ) : raceStatus.type === 'closed' ? (
                  <Alert severity="error" sx={styles.alert}>
                    エントリー締切済み
                  </Alert>
                ) : raceStatus.type === 'undetermined' ? (
                  <Alert severity="warning" sx={styles.alert}>
                    エントリー開始日未定
                  </Alert>
                ) : raceStatus.type === 'upcoming' ? (
                  <Alert severity="warning" sx={styles.alert}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      エントリー開始まであと{raceStatus.daysUntil}日
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      エントリー開始: {race.entryStartDate && race.entryStartDate !== "" ? new Date(race.entryStartDate).toLocaleDateString('ja-JP') : 'エントリー開始日未定'}
                    </Typography>
                  </Alert>
                ) : raceStatus.type === 'available' ? (
                  <Alert severity="success" sx={styles.alert}>
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
                    onClick={() => onRaceSelect(race)}
                    disabled={race.formTemplate && !raceStatus.isAvailable}
                    startIcon={raceStatus.isAvailable && race.entryUrl && !race.formTemplate ? <OpenInNewIcon /> : null}
                    sx={styles.entryButton}
                  >
                    {race.formTemplate && raceStatus.isAvailable ? 'エントリーする' :
                     !race.formTemplate && race.entryUrl ? '外部サイトで確認' :
                     'レース詳細を見る'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RaceCard;