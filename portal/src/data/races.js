// Portal専用のレースデータ管理（Redux不要版）

// レースデータをキャッシュ
let racesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1分間キャッシュ

/**
 * レースデータを取得・結合する共通関数
 */
export const fetchAndMergeRaces = async (config) => {
  // ローカルファイルを取得
  const localPromises = [
    fetch(`${process.env.PUBLIC_URL}/data/races.json`).then(r => r.ok ? r.json() : []).catch(() => []),
    fetch(`${process.env.PUBLIC_URL}/data/races-jncc.json`).then(r => r.ok ? r.json() : []).catch(() => [])
  ];
  
  // 外部URLを取得
  const remotePromises = [];
  if (config['other-races']) {
    Object.values(config['other-races']).forEach(url => {
      if (typeof url === 'string' && url.trim()) {
        remotePromises.push(
          fetch(url)
            .then(r => r.ok ? r.json() : [])
            .catch(error => {
              console.warn(`⚠️ 外部レースデータ取得失敗: ${url}`, error);
              return [];
            })
        );
      }
    });
  }
  
  // すべてのデータを並行取得
  const allPromises = [...localPromises, ...remotePromises];
  const results = await Promise.all(allPromises);
  
  // 結果を結合
  let allRaces = [];
  results.forEach(races => {
    if (Array.isArray(races)) {
      allRaces = allRaces.concat(races);
    }
  });
  
  // raceIdの重複を処理（後から追加されたもの=リモートを優先）
  const uniqueRaces = [];
  const seenRaceIds = new Set();
  
  // 逆順で処理して、後から追加されたものを優先
  for (let i = allRaces.length - 1; i >= 0; i--) {
    const race = allRaces[i];
    if (race && race.raceId && !seenRaceIds.has(race.raceId)) {
      seenRaceIds.add(race.raceId);
      uniqueRaces.unshift(race); // 先頭に追加して元の順序を保持
    }
  }
  
  return uniqueRaces;
};

// レースデータを取得（ローカルファイルと外部URLから取得）
export const getRaces = async () => {
  const now = Date.now();
  
  // キャッシュが有効な場合はキャッシュを返す
  if (racesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return racesCache;
  }
  
  try {
    // config.jsonを取得
    const configResponse = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    const config = configResponse.ok ? await configResponse.json() : {};
    
    // 共通関数を使用してレースデータを取得
    const uniqueRaces = await fetchAndMergeRaces(config);
    
    racesCache = uniqueRaces;
    cacheTimestamp = now;
    return uniqueRaces;
  } catch (error) {
    console.error('❌ レースデータ取得エラー:', error);
    
    // エラー時は空配列を返す
    racesCache = [];
    cacheTimestamp = now;
    return [];
  }
};

// 直近のエントリー可能なレースを取得
export const getUpcomingAvailableRaces = async () => {
  const races = await getRaces();
  const now = new Date();
  return races
    .filter(race => {
      const raceEnd = new Date(race.endDate);
      return raceEnd >= now;
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3); // 最大3件
};



// シリーズとラウンドの表示フォーマット（併催対応）
export const formatSeriesWithRound = (race) => {
  if (!Array.isArray(race.series)) {
    return `${race.series} Rd.${race.round}`;
  }
  
  // 併催の場合：「全日本 Rd.2 中日本併催」のように表示
  const primary = race.series[0];
  const secondary = race.series.slice(1);
  
  if (secondary.length === 0) {
    return `${primary} Rd.${race.round}`;
  }
  
  return `${primary} Rd.${race.round} ${secondary.join('・')}併催`;
};



// レースがシリーズに含まれるかチェック
export const raceIncludesSeries = (race, seriesName) => {
  if (!Array.isArray(race.series)) {
    return race.series === seriesName;
  }
  return race.series.includes(seriesName);
};



// エントリー締切日を取得
export const getEntryDeadline = (race) => {
  // entryEndDateがある場合はそれを使用、なければstartDateの19日前
  if (race.entryEndDate) {
    return new Date(race.entryEndDate);
  }
  const raceStart = new Date(race.startDate);
  const deadline = new Date(raceStart);
  deadline.setDate(deadline.getDate() - 19);
  return deadline;
};

// レースの状態を判定
export const getRaceStatus = (race) => {
  const now = new Date();
  const entryDeadline = getEntryDeadline(race);
  const raceEnd = new Date(race.endDate);
  
  // エントリー可能かチェック（インライン化）
  const isAvailable = (() => {
    // entryStartDateが空文字の場合はエントリー不可
    if (!race.entryStartDate || race.entryStartDate === "") {
      return false;
    }
    
    const entryStart = new Date(race.entryStartDate);
    const entryEnd = new Date(race.entryEndDate);
    
    // エントリー開始日以降、かつエントリー締切日前
    return now >= entryStart && now <= entryEnd;
  })();
  
  const daysUntil = getDaysUntilEntry(race);
  
  // レース終了
  if (raceEnd < now) {
    return {
      type: 'past',
      label: '終了',
      isAvailable: false,
    };
  }
  
  // エントリー締切後
  if (now > entryDeadline && !isAvailable) {
    return {
      type: 'closed',
      label: 'エントリー締切',
      isAvailable: false,
    };
  }
  
  // エントリー開始日未定（空文字の場合）
  if (!race.entryStartDate || race.entryStartDate === "") {
    return {
      type: 'undetermined',
      label: 'エントリー開始日未定',
      isAvailable: false,
    };
  }
  
  // エントリー開始前
  if (daysUntil > 0 && !isAvailable) {
    return {
      type: 'upcoming',
      label: 'エントリー準備中',
      isAvailable: false,
      daysUntil,
    };
  }
  
  // エントリー受付中
  if (isAvailable) {
    return {
      type: 'available',
      label: 'エントリーする',
      isAvailable: true,
      deadline: entryDeadline,
    };
  }
  
  // デフォルト
  return {
    type: 'unavailable',
    label: 'エントリー準備中',
    isAvailable: false,
  };
};

// 日付をフォーマット
export const formatRaceDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  
  // 開始日と終了日が同じ場合は1日開催
  if (startDate === endDate) {
    return `${startMonth}月${startDay}日`;
  }
  
  // 同じ月内の複数日開催
  if (startMonth === endMonth) {
    return `${startMonth}月${startDay}日-${endDay}日`;
  }
  
  // 月をまたぐ複数日開催
  return `${startMonth}月${startDay}日-${endMonth}月${endDay}日`;
};

// エントリー開始日までの日数を計算
export const getDaysUntilEntry = (race) => {
  // entryStartDateが空文字の場合は-1を返す
  if (!race.entryStartDate || race.entryStartDate === "") {
    return -1;
  }
  
  const now = new Date();
  const entryStart = new Date(race.entryStartDate);
  const diffTime = entryStart - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// レースのクラス情報を安全に取得
export const getRaceClasses = (race) => {
  // classesが存在しない、または空オブジェクトの場合のフォールバック
  if (!race.classes || typeof race.classes !== 'object') {
    return {
      official: [],
      approved: []
    };
  }
  
  return {
    official: Array.isArray(race.classes.official) ? race.classes.official : [],
    approved: Array.isArray(race.classes.approved) ? race.classes.approved : []
  };
};