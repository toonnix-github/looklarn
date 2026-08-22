/**
 * Format currency amount in THB with locale-appropriate symbol/suffix
 * @param {number} amount 
 * @param {'th'|'en'} lang 
 * @param {object} options 
 * @returns {string} e.g. "฿500" or "฿500 / นัด"
 */
export function formatCurrency(amount, lang = 'th', options = {}) {
  const { showUnit = false, unit = 'hour', symbol = '฿' } = options;
  if (amount == null || isNaN(amount)) return '-';
  
  const formattedNumber = new Intl.NumberFormat('th-TH').format(amount);
  
  if (showUnit) {
    if (lang === 'th') {
      const unitText = unit === 'hour' ? '/ นัด' : unit === 'trip' ? '/ ทริป' : ' บาท';
      return `${symbol}${formattedNumber} ${unitText}`.trim();
    } else {
      const unitText = unit === 'hour' ? '/booking' : unit === 'trip' ? '/trip' : ' THB';
      return `${symbol}${formattedNumber}${unitText}`;
    }
  }
  
  return `${symbol}${formattedNumber}`;
}

/**
 * Format date supporting Thai Buddhist Era (พ.ศ. = AD + 543) and Gregorian calendar
 * @param {string|Date} dateInput 
 * @param {'th'|'en'} lang 
 * @param {'short'|'medium'|'full'|'time'} formatStyle 
 * @returns {string}
 */
export function formatDate(dateInput, lang = 'th', formatStyle = 'medium') {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  if (lang === 'th') {
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiMonthsFull = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiDaysFull = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

    const day = date.getDate();
    const month = date.getMonth();
    const yearBE = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    switch (formatStyle) {
      case 'short':
        return `${day} ${thaiMonthsShort[month]} ${String(yearBE).slice(-2)}`;
      case 'full':
        return `${thaiDaysFull[date.getDay()]}ที่ ${day} ${thaiMonthsFull[month]} พ.ศ. ${yearBE}`;
      case 'time':
        return `${hours}:${minutes} น.`;
      case 'medium':
      default:
        return `${day} ${thaiMonthsShort[month]} ${yearBE}`;
    }
  } else {
    switch (formatStyle) {
      case 'short':
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' });
      case 'full':
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      case 'time':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      case 'medium':
      default:
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
}

/**
 * Format match score and provide color metadata
 * @param {number} score 
 * @returns {{ scoreText: string, colorClass: string, strokeColor: string, hexColor: string, tier: string }}
 */
export function formatMatchScore(score) {
  const numScore = Math.round(Number(score) || 0);
  if (numScore >= 90) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
      strokeColor: 'stroke-blue-600',
      hexColor: '#2563EB',
      tier: 'excellent'
    };
  }
  if (numScore >= 80) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-sky-600 bg-sky-50 border-sky-200',
      strokeColor: 'stroke-sky-500',
      hexColor: '#38BDF8',
      tier: 'great'
    };
  }
  if (numScore >= 70) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
      strokeColor: 'stroke-amber-500',
      hexColor: '#F59E0B',
      tier: 'good'
    };
  }
  return {
    scoreText: `${numScore}%`,
    colorClass: 'text-slate-600 bg-slate-100 border-slate-200',
    strokeColor: 'stroke-slate-400',
    hexColor: '#94A3B8',
    tier: 'standard'
  };
}

/**
 * Format duration string
 */
export function formatDuration(hours, lang = 'th') {
  if (!hours) return '-';
  return lang === 'th' ? `${hours} ชั่วโมง` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
