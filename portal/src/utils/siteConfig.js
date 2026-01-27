// Portal専用のサイト設定管理（環境別対応）

import { fetchAndMergeRaces } from '../data/races.js';

/**
 * 設定ファイルを取得
 */
const getConfig = async () => {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    return await response.json();
  } catch (error) {
    console.error('❌ config.json取得エラー:', error);
    return { environment: 'dev' }; // デフォルト
  }
};

/**
 * エントリーURLを生成（Portal→Entry遷移用）
 */
export const getEntryUrl = async (race) => {
  const config = await getConfig();
  
  // formTemplateなし
  if (!race.formTemplate) {
    // entryUrlがある → 外部サイトとしてentryUrlを使用
    if (race.entryUrl) {
      return race.entryUrl;
    }
    // entryUrlがない → nullを返す（ボタンを表示しない）
    return null;
  }
  
  // formTemplateあり＆dev → config.jsonのentryBaseUrlを使用
  if (race.formTemplate && config.environment === 'dev') {
    const portalUrl = encodeURIComponent(window.location.origin);
    return `${config.entryBaseUrl}/race/${race.raceId}?portal=${portalUrl}`;
  }
  
  // formTemplateあり＆prod → entryUrlを使用（エントリーサイトに遷移）
  if (race.formTemplate && config.environment === 'prod') {
    // entryUrlがある → entryUrlを使用してエントリーサイトに遷移
    if (race.entryUrl) {
      return race.entryUrl;
    }
    // entryUrlがない → nullを返す（ボタンを表示しない）
    return null;
  }
  
  // フォールバック（通常ここには来ない）
  return null;
};

/**
 * 直リンク処理（Portal側でハッシュを検出した場合）
 */
export const handleDirectLink = async () => {
  const hash = window.location.hash.slice(1); // #を除去
  if (hash) {
    try {
      // config.jsonを取得
      const config = await getConfig();
      
      // 共通関数を使用してレースデータを取得
      const uniqueRaces = await fetchAndMergeRaces(config);
      
      const race = uniqueRaces.find(r => r.raceId === hash);
      
      if (race) {
        const entryUrl = await getEntryUrl(race);
        if (entryUrl) {
          window.location.href = entryUrl;
        }
      }
    } catch (error) {
      console.error('直リンク処理エラー:', error);
    }
  }
};