import { describe, expect, it } from "vitest";
import {
  ATTENDANCE_FROM,
  ATTENDANCE_REMINDER_TO,
  ATTENDANCE_REPORT_TO,
  attendanceFormUrl,
  attendanceWeek,
  attendanceWeekId,
  attendanceWeekStartFromId,
  isAttendanceWeekId,
  buildReminderEmail,
  buildReportEmail,
  isPacificFourPmWednesday,
  pacificMondayDate,
  parseWeekStart,
  readAttendanceFields,
} from "./attendance";

describe("pacific week helpers", () => {
  it("treats only 4pm Pacific on Wednesday as send time", () => {
    expect(isPacificFourPmWednesday(new Date("2026-09-09T23:00:00.000Z"))).toBe(
      true,
    );
    expect(isPacificFourPmWednesday(new Date("2026-09-09T19:00:00.000Z"))).toBe(
      false,
    );
    expect(isPacificFourPmWednesday(new Date("2026-01-08T00:00:00.000Z"))).toBe(
      true,
    );
    expect(isPacificFourPmWednesday(new Date("2026-01-07T23:00:00.000Z"))).toBe(
      false,
    );
    expect(isPacificFourPmWednesday(new Date("2026-09-08T23:00:00.000Z"))).toBe(
      false,
    );
  });

  it("finds Monday of the current Pacific week", () => {
    expect(pacificMondayDate(new Date("2026-09-05T18:00:00.000Z"))).toBe(
      "2026-08-31",
    );
    expect(pacificMondayDate(new Date("2026-09-09T19:00:00.000Z"))).toBe(
      "2026-09-07",
    );
  });

  it("accepts a real calendar date and rejects junk", () => {
    expect(parseWeekStart("2026-08-31")).toBe("2026-08-31");
    expect(parseWeekStart("2026-02-29")).toBeUndefined();
    expect(parseWeekStart("08-31-2026")).toBeUndefined();
  });

  it("labels a Monday–Sunday week", () => {
    expect(attendanceWeek("2026-08-31")).toEqual({
      start: "2026-08-31",
      end: "2026-09-06",
      label: "Monday, August 31 – Sunday, September 6, 2026",
    });
  });

  it("names a week as year plus ISO week number", () => {
    expect(attendanceWeekId("2026-08-31")).toBe("2026-36");
    expect(attendanceWeekId("2025-12-29")).toBe("2026-01");
    expect(attendanceWeekId("2026-01-05")).toBe("2026-02");
    expect(attendanceWeekStartFromId("2026-36")).toBe("2026-08-31");
    expect(attendanceWeekStartFromId("2026-01")).toBe("2025-12-29");
    expect(isAttendanceWeekId("2026-36")).toBe(true);
    expect(isAttendanceWeekId("2026-99")).toBe(false);
    expect(isAttendanceWeekId("2c1d6b3a-4f10-4a22-9b80-6d2e1f0a9c11")).toBe(
      false,
    );
  });
});

describe("readAttendanceFields", () => {
  function form(fields: Record<string, string>): FormData {
    const data = new FormData();
    for (const [name, value] of Object.entries(fields)) {
      data.set(name, value);
    }
    return data;
  }

  it("reads a complete report", () => {
    expect(
      readAttendanceFields(
        form({
          week: "2026-08-31",
          santosDays: "4",
          blancaDays: "5",
          comment: "  Santos left early Friday.  ",
        }),
      ),
    ).toEqual({
      weekStart: "2026-08-31",
      santosDays: 4,
      blancaDays: 5,
      comment: "Santos left early Friday.",
    });
  });

  it("rejects missing or out-of-range days", () => {
    expect(
      readAttendanceFields(
        form({ week: "2026-08-31", blancaDays: "2", comment: "" }),
      ),
    ).toEqual({
      error: "Enter how many days each person worked, from 0 to 7.",
    });
    expect(
      readAttendanceFields(
        form({
          week: "2026-08-31",
          santosDays: "8",
          blancaDays: "1",
          comment: "",
        }),
      ),
    ).toEqual({
      error: "Enter how many days each person worked, from 0 to 7.",
    });
    expect(
      readAttendanceFields(
        form({
          week: "2026-08-31",
          santosDays: "1.5",
          blancaDays: "1",
          comment: "",
        }),
      ),
    ).toEqual({
      error: "Enter how many days each person worked, from 0 to 7.",
    });
  });
});

describe("attendance emails", () => {
  const week = attendanceWeek("2026-08-31");

  it("builds a reminder with the form link", () => {
    const url = attendanceFormUrl(
      "https://ranch.knipe.io",
      week.start,
    );
    const email = buildReminderEmail(week, url);

    expect(url).toBe("https://ranch.knipe.io/attendance?week=2026-08-31");
    expect(email).toMatchObject({
      to: ATTENDANCE_REMINDER_TO,
      from: ATTENDANCE_FROM,
      subject: "Ranch crew hours for the week of 2026-08-31",
    });
    expect(email.text).toContain(url);
    expect(email.html).toContain(url);
    expect(email.text).toContain("photo of Santos's hours sheet");
  });

  it("builds a report for Suze", () => {
    const email = buildReportEmail({
      week,
      santosDays: 1,
      blancaDays: 0,
      comment: "Blanca was out sick.",
    });

    expect(email).toMatchObject({
      to: ATTENDANCE_REPORT_TO,
      from: ATTENDANCE_FROM,
      subject: "Crew hours: week of 2026-08-31",
    });
    expect(email.text).toContain("Santos: 1 day");
    expect(email.text).toContain("Blanca: 0 days");
    expect(email.text).toContain("Blanca was out sick.");
    expect(email.text).toContain("Hours sheet: attached");
  });

  it("includes a link to the stored sheet when we have one", () => {
    const email = buildReportEmail({
      week,
      santosDays: 1,
      blancaDays: 0,
      comment: "",
      sheetUrl: "https://ranch.knipe.io/attendance/sheet/abc",
    });

    expect(email.text).toContain(
      "Hours sheet: https://ranch.knipe.io/attendance/sheet/abc",
    );
    expect(email.html).toContain("https://ranch.knipe.io/attendance/sheet/abc");
  });
});
