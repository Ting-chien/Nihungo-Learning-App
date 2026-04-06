export interface KanaEntry {
  kana: string
  romaji: string
}

const _ = { kana: '', romaji: '' }

// Each row has exactly 5 entries at their correct vowel positions (a,i,u,e,o).
// Empty entries (_) hold the grid position for rows with fewer sounds (ya, wa, n).
export const HIRAGANA: KanaEntry[][] = [
  [{ kana: 'あ', romaji: 'a' }, { kana: 'い', romaji: 'i' }, { kana: 'う', romaji: 'u' }, { kana: 'え', romaji: 'e' }, { kana: 'お', romaji: 'o' }],
  [{ kana: 'か', romaji: 'ka' }, { kana: 'き', romaji: 'ki' }, { kana: 'く', romaji: 'ku' }, { kana: 'け', romaji: 'ke' }, { kana: 'こ', romaji: 'ko' }],
  [{ kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' }],
  [{ kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' }],
  [{ kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' }],
  [{ kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' }],
  [{ kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' }],
  // ya-row: ゆ is at the 'u' position, よ at the 'o' position
  [{ kana: 'や', romaji: 'ya' }, _, { kana: 'ゆ', romaji: 'yu' }, _, { kana: 'よ', romaji: 'yo' }],
  [{ kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' }],
  // wa-row: を is at the 'o' position
  [{ kana: 'わ', romaji: 'wa' }, _, _, _, { kana: 'を', romaji: 'wo' }],
  [{ kana: 'ん', romaji: 'n' }, _, _, _, _],
]

export const KATAKANA: KanaEntry[][] = [
  [{ kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }],
  [{ kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' }],
  [{ kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }],
  [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }],
  [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }],
  [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }],
  [{ kana: 'マ', romaji: 'ma' }, { kana: 'ミ', romaji: 'mi' }, { kana: 'ム', romaji: 'mu' }, { kana: 'メ', romaji: 'me' }, { kana: 'モ', romaji: 'mo' }],
  [{ kana: 'ヤ', romaji: 'ya' }, _, { kana: 'ユ', romaji: 'yu' }, _, { kana: 'ヨ', romaji: 'yo' }],
  [{ kana: 'ラ', romaji: 'ra' }, { kana: 'リ', romaji: 'ri' }, { kana: 'ル', romaji: 'ru' }, { kana: 'レ', romaji: 're' }, { kana: 'ロ', romaji: 'ro' }],
  [{ kana: 'ワ', romaji: 'wa' }, _, _, _, { kana: 'ヲ', romaji: 'wo' }],
  [{ kana: 'ン', romaji: 'n' }, _, _, _, _],
]

// Keep GOJUUON as an alias for backward compatibility with quiz features
export const GOJUUON = HIRAGANA

/** Flat list of all valid hiragana entries (no placeholders) */
export const KANA_FLAT: KanaEntry[] = HIRAGANA.flat().filter((e) => e.romaji !== '')

/** Pick N unique random entries from the flat list */
export function sampleKana(n: number): KanaEntry[] {
  const pool = [...KANA_FLAT]
  const result: KanaEntry[] = []
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}
