import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Fab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useRaceSelection } from '../hooks/useRaceSelection';
import RaceCard from '../components/RaceCard';
import RaceFilter from '../components/RaceFilter';
import { styles } from './RaceSelectionPage.styles';

const RaceSelectionPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    seriesList,
    selectedSeries,
    showPastRaces,
    filteredRaces,
    displayedRaces,
    hasMore,
    raceEntryUrls,
    showScrollTop,
    handleLoadMore,
    handleSeriesChange,
    handleShowPastRacesChange,
    handleRaceSelect,
    handleDownloadICal,
    handleGoogleCalendar,
    scrollToTop,
  } = useRaceSelection();

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="lg" sx={styles.container}>
        <Box sx={styles.header}>
          <Typography {...styles.title}>
            レース一覧
          </Typography>
        </Box>

        {/* フィルター部分 */}
        <RaceFilter
          seriesList={seriesList}
          selectedSeries={selectedSeries}
          showPastRaces={showPastRaces}
          filteredRaces={filteredRaces}
          onSeriesChange={handleSeriesChange}
          onShowPastRacesChange={handleShowPastRacesChange}
          onDownloadICal={handleDownloadICal}
        />

        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {displayedRaces.map((race) => (
              <RaceCard
                key={race.raceId}
                race={race}
                raceEntryUrls={raceEntryUrls}
                onRaceSelect={handleRaceSelect}
              />
            ))}
          </Grid>
        )}

        {/* さらに表示するボタン */}
        {hasMore && (
          <Box sx={styles.loadMoreContainer}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleLoadMore}
              endIcon={<ExpandMoreIcon />}
              sx={styles.loadMoreButton}
            >
              さらに表示する ({filteredRaces.length - displayedRaces.length}件)
            </Button>
          </Box>
        )}

        <Box sx={styles.homeButtonContainer}>
          <Button
            onClick={() => navigate('/')}
            variant="outlined"
            color="primary"
            size="large"
          >
            ホームに戻る
          </Button>
        </Box>

        {/* スクロールトップボタン */}
        {showScrollTop && (
          <Fab
            onClick={scrollToTop}
            sx={styles.scrollTopFab}
            size="medium"
            aria-label="ページトップに戻る"
          >
            <KeyboardArrowUpIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );
};

export default RaceSelectionPage;