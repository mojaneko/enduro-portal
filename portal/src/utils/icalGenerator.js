/**
 * iCal形式のカレンダーファイルを生成するユーティリティ
 */

/**
 * 日付をiCal形式に変換
 * @param {string} dateString - ISO形式の日付文字列
 * @returns {string} - iCal形式の日付文字列
 */
const formatDateForICal = (dateString) => {
  const date = new Date(dateString);
  // iCal形式: YYYYMMDDTHHMMSSZ
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * テキストをiCal用にエスケープ
 * @param {string} text - エスケープするテキスト
 * @returns {string} - エスケープされたテキスト
 */
const escapeICalText = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
};

/**
 * レースデータからiCalイベントを生成
 * @param {Object} race - レースデータ
 * @returns {string} - iCalイベント文字列
 */
const generateICalEvent = (race) => {
  const startDate = formatDateForICal(race.startDate);
  const endDate = formatDateForICal(race.endDate);
  
  // シリーズ情報の整理
  const seriesText = Array.isArray(race.series) 
    ? race.series.join('・') 
    : race.series;
  
  // クラス情報の整理
  const classes = [];
  if (race.classes?.official?.length > 0) {
    classes.push(`公認: ${race.classes.official.join(', ')}`);
  }
  if (race.classes?.approved?.length > 0) {
    classes.push(`承認: ${race.classes.approved.join(', ')}`);
  }
  const classesText = classes.length > 0 ? classes.join(' / ') : '';
  
  // 説明文の作成
  const description = [
    `シリーズ: ${seriesText}`,
    `ラウンド: ${race.round}`,
    classesText && `クラス: ${classesText}`,
    race.entryStartDate && race.entryStartDate !== '' && `エントリー開始: ${new Date(race.entryStartDate).toLocaleDateString('ja-JP')}`,
    race.entryEndDate && race.entryEndDate !== '' && `エントリー締切: ${new Date(race.entryEndDate).toLocaleDateString('ja-JP')}`,
  ].filter(Boolean).join('\\n');
  
  return `BEGIN:VEVENT
UID:${race.raceId}@enduro-races.jp
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICalText(race.name)}
LOCATION:${escapeICalText(`${race.venue}, ${race.location}`)}
DESCRIPTION:${escapeICalText(description)}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT`;
};

/**
 * レース配列からiCalファイル内容を生成
 * @param {Array} races - レースデータの配列
 * @param {string} filterInfo - フィルター情報（ファイル名用）
 * @returns {string} - iCalファイルの内容
 */
export const generateICalContent = (races, filterInfo = '') => {
  const events = races.map(generateICalEvent).join('\n');
  
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Enduro Races Calendar//JP
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:エンデューロレース${filterInfo ? ` (${filterInfo})` : ''}
X-WR-CALDESC:日本エンデューロ選手権レースカレンダー
X-WR-TIMEZONE:Asia/Tokyo
DTSTAMP:${now}
${events}
END:VCALENDAR`;
};

/**
 * iCalファイルをダウンロード
 * @param {Array} races - レースデータの配列
 * @param {string} filename - ファイル名（拡張子なし）
 * @param {string} filterInfo - フィルター情報
 */
export const downloadICalFile = (races, filename = 'enduro-races', filterInfo = '') => {
  const icalContent = generateICalContent(races, filterInfo);
  
  // BOMを追加してUTF-8として保存
  const bom = '\uFEFF';
  const blob = new Blob([bom + icalContent], { 
    type: 'text/calendar;charset=utf-8' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};