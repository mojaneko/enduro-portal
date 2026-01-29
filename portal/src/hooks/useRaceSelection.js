import { useState, useMemo, useEffect } from 'react';
import { getRaces, raceIncludesSeries } from '../data/races';
import { getEntryUrl, handleDirectLink } from '../utils/siteConfig';
import { downloadICalFile, generateGoogleCalendarUrl } from '../utils/icalGenerator';

const ITEMS_PER_PAGE = 7;

export const useRaceSelection = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState(['すべて']);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [showPastRaces, setShowPastRaces] = useState(false);
  const [raceEntryUrls, setRaceEntryUrls] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // レースデータの読み込み
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

  // スクロール監視
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    
    // 指定された順番（「すべて」は除く）
    const seriesOrder = [
      '全日本',
      '北海道',
      '東日本',
      '中日本',
      'オーランド',
      '西日本',
      '九州',
      'JNCC',
      'WEX-East',
      'WEX-West'
    ];
    
    // 指定順に並び替え、その後に新しいシリーズを追加
    const orderedSeries = ['すべて']; // 「すべて」を先頭に固定
    const remainingSeries = new Set(seriesSet);
    
    // 指定順のシリーズを追加
    seriesOrder.forEach(series => {
      if (remainingSeries.has(series)) {
        orderedSeries.push(series);
        remainingSeries.delete(series);
      }
    });
    
    // 残りのシリーズを追加（今後追加されるもの）
    remainingSeries.forEach(series => {
      orderedSeries.push(series);
    });
    
    return orderedSeries;
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
    if (!selectedSeries.includes('すべて') && selectedSeries.length > 0) {
      filtered = filtered.filter(race => 
        selectedSeries.some(series => raceIncludesSeries(race, series))
      );
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

  // ハンドラー関数
  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredRaces.length));
  };

  const handleSeriesChange = (series) => {
    if (series === 'すべて') {
      setSelectedSeries(['すべて']); // 「すべて」選択時は他をクリア
      setDisplayCount(ITEMS_PER_PAGE);
    } else {
      setSelectedSeries(prev => {
        const withoutAll = prev.filter(s => s !== 'すべて'); // 「すべて」を除去
        if (withoutAll.includes(series)) {
          // 既に選択済み → 削除
          const newSelection = withoutAll.filter(s => s !== series);
          return newSelection.length === 0 ? ['すべて'] : newSelection; // 空なら「すべて」
        } else {
          // 未選択 → 追加
          return [...withoutAll, series];
        }
      });
      setDisplayCount(ITEMS_PER_PAGE); // リセット
    }
  };

  const handleShowPastRacesChange = (checked) => {
    setShowPastRaces(checked);
  };

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

  const handleDownloadICal = () => {
    const filterInfo = selectedSeries.includes('すべて') ? '' : selectedSeries.join('・');
    const filename = selectedSeries.includes('すべて') 
      ? 'enduro-races' 
      : `enduro-races-${selectedSeries.join('-').replace(/[^a-zA-Z0-9-]/g, '')}`;
    
    downloadICalFile(filteredRaces, filename, filterInfo);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    // State
    races,
    loading,
    selectedSeries,
    displayCount,
    showPastRaces,
    raceEntryUrls,
    showScrollTop,
    
    // Computed values
    seriesList,
    filteredRaces,
    displayedRaces,
    hasMore,
    
    // Handlers
    handleLoadMore,
    handleSeriesChange,
    handleShowPastRacesChange,
    handleRaceSelect,
    handleDownloadICal,
    scrollToTop,
  };
};