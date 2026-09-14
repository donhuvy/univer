/**
 * BKIT Office - Vietnamese Utilities Module
 * Tiện ích văn phòng chuẩn Việt Nam:
 * 1. Đọc số tiền thành chữ (Number to Vietnamese Words)
 * 2. Chuyển đổi font chữ cổ (TCVN3 / ABC, VNI-Times) sang Unicode
 * 3. Chuyển đổi kiểu chữ (Chữ hoa, thường, viết hoa đầu từ, bỏ dấu)
 */

// Bảng ánh xạ font TCVN3 (ABC) sang Unicode
const TCVN3_TO_UNICODE: Record<string, string> = {
  'µ': 'à', '¸': 'á', '¶': 'ả', '·': 'ã', '¹': 'ạ',
  '¨': 'ă', '»': 'ằ', '¾': 'ắ', '¼': 'ẳ', '½': 'ẵ', 'Æ': 'ặ',
  '©': 'â', 'Ç': 'ầ', 'Ê': 'ấ', 'È': 'ẩ', 'É': 'ẫ', 'Ë': 'ậ',
  '®': 'đ',
  'Ì': 'è', 'Ð': 'é', 'Î': 'ẻ', 'Ï': 'ẽ', 'Ñ': 'ẹ',
  'ª': 'ê', 'Ò': 'ề', 'Õ': 'ế', 'Ó': 'ể', 'Ô': 'ễ', 'Ö': 'ệ',
  '×': 'ì', 'Ý': 'í', 'Ø': 'ỉ', 'Ü': 'ĩ', 'Þ': 'ị',
  'ß': 'ò', 'á': 'ó', 'à': 'ỏ', 'ã': 'õ', 'ä': 'ọ',
  '«': 'ô', 'å': 'ồ', 'è': 'ố', 'æ': 'ổ', 'ç': 'ỗ', 'é': 'ộ',
  '¬': 'ơ', 'ê': 'ờ', 'í': 'ớ', 'ë': 'ở', 'ì': 'ỡ', 'î': 'ợ',
  'ï': 'ù', 'ó': 'ú', 'ñ': 'ủ', 'ò': 'ũ', 'ô': 'ụ',
  '­': 'ư', 'õ': 'ừ', 'ø': 'ứ', 'ö': 'ử', '÷': 'ữ', 'ù': 'ự',
  'ú': 'ỳ', 'ý': 'ý', 'û': 'ỷ', 'ü': 'ỹ', 'þ': 'ỵ',
  // Chữ hoa
  '¡': 'À', '¢': 'Á', '£': 'Ả', '¤': 'Ã', '¥': 'Ạ',
  '§': 'Đ'
};

/**
 * Chuyển văn bản từ mã TCVN3 sang Unicode
 */
export function convertTCVN3ToUnicode(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += TCVN3_TO_UNICODE[char] || char;
  }
  return result;
}

/**
 * Xóa dấu tiếng Việt (Bỏ dấu)
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Chuyển đổi kiểu chữ (Case Converter)
 */
export function changeTextCase(str: string, type: 'upper' | 'lower' | 'title' | 'sentence'): string {
  switch (type) {
    case 'upper':
      return str.toUpperCase();
    case 'lower':
      return str.toLowerCase();
    case 'title':
      return str.toLowerCase().replace(/(?:^|\s|\/|-)\p{L}/gu, (match) => match.toUpperCase());
    case 'sentence':
      return str.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, (match) => match.toUpperCase());
    default:
      return str;
  }
}

const VI_DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(numStr: string, readZeroHundred: boolean): string {
  let [h, t, u] = numStr.split('').map(Number);
  let res = '';

  if (h !== 0 || readZeroHundred) {
    res += VI_DIGITS[h] + ' trăm ';
  }

  if (t === 0) {
    if ((h !== 0 || readZeroHundred) && u !== 0) {
      res += 'linh ';
    }
  } else if (t === 1) {
    res += 'mười ';
  } else {
    res += VI_DIGITS[t] + ' mươi ';
  }

  if (u === 1) {
    if (t > 1) {
      res += 'mốt';
    } else {
      res += 'một';
    }
  } else if (u === 5) {
    if (t > 0) {
      res += 'lăm';
    } else {
      res += 'năm';
    }
  } else if (u > 0) {
    res += VI_DIGITS[u];
  }

  return res.trim();
}

/**
 * Đọc số tiền thành chữ bằng tiếng Việt (Chuẩn hóa kế toán, tài chính)
 * Ví dụ: 15500000 -> "Mười lăm triệu năm trăm nghìn đồng chẵn"
 */
export function numberToVietnameseWords(value: number | string, suffix: string = 'đồng chẵn'): string {
  let cleanStr = String(value).replace(/[^0-9-]/g, '');
  if (!cleanStr || cleanStr === '-') return '';

  let isNegative = false;
  if (cleanStr.startsWith('-')) {
    isNegative = true;
    cleanStr = cleanStr.slice(1);
  }

  cleanStr = cleanStr.replace(/^0+/, '');
  if (cleanStr === '') {
    return `Không ${suffix}`.trim();
  }

  const groups: string[] = [];
  while (cleanStr.length > 0) {
    groups.unshift(cleanStr.slice(-3));
    cleanStr = cleanStr.slice(0, -3);
  }

  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let parts: string[] = [];

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i].padStart(3, '0');
    const scaleIndex = groups.length - 1 - i;
    const groupNum = parseInt(group, 10);

    if (groupNum > 0) {
      const readZeroHundred = i > 0;
      const groupText = readThreeDigits(group, readZeroHundred);
      const scale = scales[scaleIndex % scales.length];
      parts.push(`${groupText} ${scale}`.trim());
    }
  }

  let finalWords = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (isNegative) {
    finalWords = 'Âm ' + finalWords;
  }

  // Viết hoa chữ cái đầu tiên
  finalWords = finalWords.charAt(0).toUpperCase() + finalWords.slice(1);

  if (suffix) {
    finalWords += ` ${suffix}`;
  }

  return finalWords.trim();
}
