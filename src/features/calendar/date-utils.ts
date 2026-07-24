const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatYearMonth(year: number, month0: number): string {
  return `${year}-${String(month0 + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(year: number, month0: number): string {
  return `${MONTH_NAMES[month0]} ${year}`;
}

export function toIsoDate(year: number, month0: number, day: number): string {
  return `${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export interface MonthGridCell {
  date: string; // ISO
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/** Builds a Monday-start 6-week grid (42 cells) for the given month. */
export function buildMonthGrid(year: number, month0: number, todayIso: string): MonthGridCell[] {
  const firstOfMonth = new Date(Date.UTC(year, month0, 1));
  const firstWeekday = (firstOfMonth.getUTCDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, month0, 0)).getUTCDate();

  const cells: MonthGridCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth0 = month0 === 0 ? 11 : month0 - 1;
    const prevYear = month0 === 0 ? year - 1 : year;
    const date = toIsoDate(prevYear, prevMonth0, day);
    cells.push({ date, day, isCurrentMonth: false, isToday: date === todayIso });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = toIsoDate(year, month0, day);
    cells.push({ date, day, isCurrentMonth: true, isToday: date === todayIso });
  }

  const nextMonth0 = month0 === 11 ? 0 : month0 + 1;
  const nextYear = month0 === 11 ? year + 1 : year;
  let nextDay = 1;
  while (cells.length < 42) {
    const date = toIsoDate(nextYear, nextMonth0, nextDay);
    cells.push({ date, day: nextDay, isCurrentMonth: false, isToday: date === todayIso });
    nextDay++;
  }

  return cells;
}
