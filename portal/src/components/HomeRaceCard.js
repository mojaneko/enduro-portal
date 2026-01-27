import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Link,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatRaceDate, getRaceStatus, formatSeriesWithRound } from '../data/races';
import { getSeriesColor } from '../utils/seriesColors';

const HomeRaceCard = ({ race, raceEntryUrls, onRaceSelect, isMobile }) => {
  const raceStatus = getRaceStatus(race);
  const primarySeries = Array.isArray(race.series) ? race.series[0] : race.series;
  const seriesColor = getSeriesColor(primarySeries);

  return (
    <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
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
              onClick={() => onRaceSelect(race)}
              disabled={race.formTemplate && !raceStatus.isAvailable}
            >
              {race.formTemplate && raceStatus.isAvailable ? 'エントリーする' :
               !race.formTemplate && race.entryUrl ? '外部サイトでエントリー' :
               'レース詳細を見る'}
            </Button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default HomeRaceCard;