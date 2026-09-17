// Helper to get today's date in YYYY-MM-DD (Vietnam time GMT+7)
export const getVietnamTodayStr = (): string => {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const vnTime = new Date(utc + 7 * 3600000);
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Shift date string (YYYY-MM-DD) by delta days
export const shiftDateStr = (dateStr: string, deltaDays: number): string => {
  if (!dateStr) return getVietnamTodayStr();
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get yesterday's date in YYYY-MM-DD (Vietnam time GMT+7)
export const getYesterdayStr = (): string => {
  return shiftDateStr(getVietnamTodayStr(), -1);
};

// Vietnamese day of the week
export const getDayOfWeekVN = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[date.getDay()] || '';
};
