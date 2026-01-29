import {
  Box,
  Button,
  Typography,
  Chip,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getSeriesColor } from '../utils/seriesColors';
import { styles, getChipStyle } from '../pages/RaceSelectionPage.styles';

const RaceFilter = ({
  seriesList,
  selectedSeries,
  showPastRaces,
  filteredRaces,
  onSeriesChange,
  onShowPastRacesChange,
  onDownloadICal
}) => {
  return (
    <Box sx={styles.filterSection}>
      <Box sx={styles.filterHeader}>
        <Typography {...styles.filterTitle}>
          シリーズで絞り込み
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={showPastRaces}
              onChange={(e) => onShowPastRacesChange(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography {...styles.checkboxLabel}>
              終了した大会を表示
            </Typography>
          }
        />
      </Box>
      
      <Stack {...styles.chipContainer}>
        {seriesList.map((series) => {
          const seriesColor = series === 'すべて' ? null : getSeriesColor(series);
          const isSelected = selectedSeries.includes(series);
          
          return (
            <Chip
              key={series}
              label={series}
              onClick={() => onSeriesChange(series)}
              sx={getChipStyle(series, isSelected, seriesColor)}
            />
          );
        })}
      </Stack>

      {/* カレンダーダウンロードボタン */}
      {filteredRaces.length > 0 && (
        <Box sx={styles.downloadButtonContainer}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<DownloadIcon />}
            onClick={onDownloadICal}
            sx={styles.downloadButton}
          >
            カレンダーをダウンロード ({filteredRaces.length}件)
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RaceFilter;