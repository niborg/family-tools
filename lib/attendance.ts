export const PACIFIC_TZ = "America/Los_Angeles";
export const ATTENDANCE_FROM = "admin@ranch.knipe.io";
export const ATTENDANCE_REMINDER_TO = "susie.knipe@gmail.com";
export const ATTENDANCE_REPORT_TO = "suzeadmin@gmail.com";
export const ATTENDANCE_PATH = "/attendance";
export const ATTENDANCE_SITE_URL = "https://ranch.knipe.io";
export const ATTENDANCE_COMMENT_MAX = 2000;
export const ATTENDANCE_MAX_DAYS = 7;

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

export type AttendanceWeek = {
  start: string;
  end: string;
  label: string;
};

export type AttendanceReport = {
  week: AttendanceWeek;
  santosDays: number;
  blancaDays: number;
  comment: string;
};

export type AttendanceFields = {
  error: string;
} | {
  weekStart: string;
  santosDays: number;
  blancaDays: number;
  comment: string;
};

type CalendarDate = {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: number;
};

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function addCalendarDays(
  year: number,
  month: number,
  day: number,
  delta: number,
): { year: number; month: number; day: number } {
  const date = new Date(Date.UTC(year, month - 1, day + delta));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function pacificParts(now: Date): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PACIFIC_TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    weekday: read("weekday"),
    hour: Number(read("hour")),
  };
}

export function isPacificNoonWednesday(now: Date = new Date()): boolean {
  const parts = pacificParts(now);
  return parts.weekday === "Wed" && parts.hour === 12;
}

export function parseWeekStart(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const match = YMD.exec(value.trim());
  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() + 1 !== month ||
    utc.getUTCDate() !== day
  ) {
    return undefined;
  }

  return formatYmd(year, month, day);
}

export function pacificMondayDate(now: Date = new Date()): string {
  const parts = pacificParts(now);
  const weekday = WEEKDAY_INDEX[parts.weekday] ?? 1;
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const monday = addCalendarDays(parts.year, parts.month, parts.day, -daysFromMonday);
  return formatYmd(monday.year, monday.month, monday.day);
}

export function attendanceWeek(weekStart?: string, now: Date = new Date()): AttendanceWeek {
  const start = parseWeekStart(weekStart) ?? pacificMondayDate(now);
  const [year, month, day] = start.split("-").map(Number) as [number, number, number];
  const sunday = addCalendarDays(year, month, day, 6);
  const end = formatYmd(sunday.year, sunday.month, sunday.day);

  const startLabel = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" },
  );
  const endLabel = new Date(
    Date.UTC(sunday.year, sunday.month - 1, sunday.day),
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return {
    start,
    end,
    label: `${startLabel} – ${endLabel}`,
  };
}

export function attendanceFormPath(weekStart: string): string {
  return `${ATTENDANCE_PATH}?week=${weekStart}`;
}

export function attendanceFormUrl(siteUrl: string, weekStart: string): string {
  return `${siteUrl.replace(/\/$/, "")}${attendanceFormPath(weekStart)}`;
}

function parseDays(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  if (!/^\d+$/.test(value.trim())) {
    return undefined;
  }
  const days = Number(value.trim());
  if (!Number.isInteger(days) || days < 0 || days > ATTENDANCE_MAX_DAYS) {
    return undefined;
  }
  return days;
}

export function readAttendanceFields(formData: FormData): AttendanceFields {
  const weekStart = parseWeekStart(formData.get("week")) ?? pacificMondayDate();
  const santosDays = parseDays(formData.get("santosDays"));
  const blancaDays = parseDays(formData.get("blancaDays"));
  const commentValue = formData.get("comment");

  if (santosDays === undefined || blancaDays === undefined) {
    return {
      error: "Enter how many days each person worked, from 0 to 7.",
    };
  }

  if (typeof commentValue !== "string") {
    return { error: "That comment didn't come through. Try again." };
  }
  if (commentValue.length > ATTENDANCE_COMMENT_MAX) {
    return {
      error: `Keep the note under ${ATTENDANCE_COMMENT_MAX} characters.`,
    };
  }

  return {
    weekStart,
    santosDays,
    blancaDays,
    comment: commentValue.trim(),
  };
}

export function buildReminderEmail(week: AttendanceWeek, formUrl: string): {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
} {
  const subject = `Ranch crew hours for the week of ${week.start}`;
  const text = [
    "Hi Mom,",
    "",
    `Quick check-in for the ranch crew this week (${week.label}).`,
    "",
    "Please log in and tell me how many days Santos and Blanca worked:",
    formUrl,
    "",
    "Use the family password. There's a comment box if anything is worth mentioning.",
    "",
    "Love you,",
    "the tool shed",
  ].join("\n");

  const html = [
    "<p>Hi Mom,</p>",
    `<p>Quick check-in for the ranch crew this week (${escapeHtml(week.label)}).</p>`,
    `<p><a href="${escapeHtml(formUrl)}">Open this week's crew hours form</a></p>`,
    "<p>Use the family password. There's a comment box if anything is worth mentioning.</p>",
    "<p>Love you,<br>the tool shed</p>",
  ].join("");

  return {
    to: ATTENDANCE_REMINDER_TO,
    from: ATTENDANCE_FROM,
    subject,
    text,
    html,
  };
}

export function buildReportEmail(report: AttendanceReport): {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
} {
  const note = report.comment || "(none)";
  const subject = `Crew hours: week of ${report.week.start}`;
  const text = [
    `Week: ${report.week.label}`,
    `Santos: ${report.santosDays} day${report.santosDays === 1 ? "" : "s"}`,
    `Blanca: ${report.blancaDays} day${report.blancaDays === 1 ? "" : "s"}`,
    `Comment: ${note}`,
  ].join("\n");

  const html = [
    `<p><strong>Week:</strong> ${escapeHtml(report.week.label)}</p>`,
    `<p><strong>Santos:</strong> ${report.santosDays} day${report.santosDays === 1 ? "" : "s"}</p>`,
    `<p><strong>Blanca:</strong> ${report.blancaDays} day${report.blancaDays === 1 ? "" : "s"}</p>`,
    `<p><strong>Comment:</strong> ${escapeHtml(note)}</p>`,
  ].join("");

  return {
    to: ATTENDANCE_REPORT_TO,
    from: ATTENDANCE_FROM,
    subject,
    text,
    html,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
