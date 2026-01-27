// RaceSelectionPage用のスタイル定義
export const styles = {
  container: {
    py: 4
  },
  
  header: {
    mb: 4
  },
  
  title: {
    variant: "h4",
    component: "h1",
    gutterBottom: true,
    align: "center"
  },
  
  subtitle: {
    variant: "body1",
    align: "center",
    color: "text.secondary"
  },
  
  filterSection: {
    mb: 4
  },
  
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 1.5
  },
  
  filterTitle: {
    variant: "subtitle2",
    color: "text.secondary",
    fontWeight: 600
  },
  
  checkboxLabel: {
    variant: "body2",
    color: "text.secondary"
  },
  
  chipContainer: {
    direction: "row",
    spacing: 1,
    flexWrap: "wrap",
    useFlexGap: true
  },
  
  downloadButtonContainer: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center'
  },
  
  downloadButton: {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.2s ease',
  },
  
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    py: 4
  },
  
  raceGrid: {
    container: true,
    spacing: 3,
    justifyContent: "center"
  },
  
  raceCard: {
    width: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6,
    },
  },
  
  raceCardContent: {
    p: { xs: 2, md: 2.5 }
  },
  
  seriesBadge: {
    minWidth: 80,
    height: 32,
    borderRadius: 2,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    textAlign: 'center',
    px: 1,
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    lineHeight: 1.2,
  },
  
  raceTitle: {
    variant: "h6",
    gutterBottom: true,
    fontWeight: 600
  },
  
  raceInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 0.5,
    flexWrap: 'wrap'
  },
  
  raceInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  },
  
  raceInfoText: {
    variant: "body2",
    color: "text.secondary"
  },
  
  venueLink: {
    underline: "hover",
    color: "inherit",
    cursor: 'pointer'
  },
  
  classesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
    mt: 1
  },
  
  classLabel: {
    variant: "caption",
    color: "text.secondary",
    mr: 0.5
  },
  
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5
  },
  
  alert: {
    py: 0.5
  },
  
  entryButton: {
    minHeight: 48
  },
  
  loadMoreContainer: {
    mt: 4,
    textAlign: 'center'
  },
  
  loadMoreButton: {
    minWidth: 200,
    borderRadius: 2,
    py: 1.5,
  },
  
  homeButtonContainer: {
    mt: 4,
    textAlign: 'center'
  },
  
  scrollTopFab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(25, 118, 210, 0.8)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.9)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
  }
};

// チップのスタイル生成関数
export const getChipStyle = (series, isSelected, seriesColor) => {
  if (series === 'すべて') {
    return {
      fontWeight: isSelected ? 600 : 400,
      fontSize: '0.85rem',
      px: 1,
      height: 36,
      borderRadius: 18,
      transition: 'all 0.2s ease',
      bgcolor: isSelected ? 'primary.main' : 'grey.200',
      color: isSelected ? 'white' : 'text.primary',
      '&:hover': {
        bgcolor: isSelected ? 'primary.dark' : 'grey.300',
      },
    };
  }
  
  return {
    fontWeight: isSelected ? 600 : 400,
    fontSize: '0.85rem',
    px: 1,
    height: 36,
    borderRadius: 18,
    transition: 'all 0.2s ease',
    bgcolor: isSelected ? seriesColor.main : 'white',
    color: isSelected ? 'white' : seriesColor.main,
    border: `2px solid ${seriesColor.main}`,
    '&:hover': {
      bgcolor: isSelected ? seriesColor.dark : seriesColor.light,
      color: isSelected ? 'white' : seriesColor.main,
    },
  };
};

// レースカードのスタイル生成関数
export const getRaceCardStyle = (raceStatus) => ({
  ...styles.raceCard,
  opacity: raceStatus.isAvailable ? 1 : 0.7,
});

// シリーズバッジの背景生成関数
export const getSeriesBadgeBackground = (race, seriesColor, getSeriesColor) => {
  if (Array.isArray(race.series) && race.series.length > 1) {
    return `linear-gradient(135deg, ${seriesColor.main} 0%, ${seriesColor.main} 50%, ${getSeriesColor(race.series[1]).main} 50%, ${getSeriesColor(race.series[1]).main} 100%)`;
  }
  return seriesColor.main;
};