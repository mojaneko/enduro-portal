// シリーズごとの色定義（Portal専用）
export const SERIES_COLORS = {
  '全日本': {
    main: '#1976d2', // 青
    light: '#42a5f5',
    dark: '#1565c0',
  },
  '東日本': {
    main: '#2e7d32', // 緑
    light: '#4caf50',
    dark: '#1b5e20',
  },
  '中日本': {
    main: '#d32f2f', // 赤
    light: '#ef5350',
    dark: '#c62828',
  },
  'オーランド': {
    main: '#d3a42f', // ゴールド
    light: '#e6c766',
    dark: '#b8941a',
  },
  '西日本': {
    main: '#ed6c02', // オレンジ
    light: '#ff9800',
    dark: '#e65100',
  },
  '北海道': {
    main: '#0288d1', // 水色
    light: '#03a9f4',
    dark: '#01579b',
  },
  'JNCC': {
    main: '#424242', // 濃いグレー
    light: '#616161',
    dark: '#212121',
  },
  'WEX-East': {
    main: '#9e9e9e', // 淡いグレー
    light: '#bdbdbd',
    dark: '#757575',
  },
  'WEX-West': {
    main: '#9e9e9e', // 淡いグレー
    light: '#bdbdbd',
    dark: '#757575',
  },
};

// シリーズ名から色を取得
export const getSeriesColor = (series) => {
  return SERIES_COLORS[series] || SERIES_COLORS['全日本'];
};

// シリーズ名からMUIのカラー名を取得（primary, success, error, warning, info）
export const getSeriesMuiColor = (series) => {
  const colorMap = {
    '全日本': 'primary',
    '東日本': 'success',
    '中日本': 'error',
    'オーランド': 'warning',
    '西日本': 'warning',
    '北海道': 'info',
    'JNCC': 'secondary',
    'WEX-East': 'secondary',
    'WEX-West': 'secondary',
  };
  return colorMap[series] || 'primary';
};