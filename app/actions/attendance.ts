"use server";

import {
  ATTENDANCE_SITE_URL,
  attendanceWeek,
  attendanceWeekId,
  buildReportEmail,
  readAttendanceFields,
} from "@/lib/attendance";
import {
  compressAttendanceSheet,
  jpegAttachment,
  validateAttendanceSheet,
  writeAttendanceSheet,
  writeAttendanceSheetMeta,
} from "@/lib/attendance-sheet";
import { isAuthenticated } from "@/lib/auth";
import { getEmailSender, sendRanchEmail } from "@/lib/email";
import { getImagesBinding } from "@/lib/images";

export type AttendanceState = {
  error?: string;
  sent?: boolean;
  weekId?: string;
};

export async function submitAttendance(
  _prev: AttendanceState | undefined,
  formData: FormData,
): Promise<AttendanceState> {
  if (!(await isAuthenticated())) {
    return { error: "Please log in again." };
  }

  const sheet = validateAttendanceSheet(formData.get("sheet"));
  if (!sheet.ok) {
    return { error: sheet.error };
  }

  const fields = readAttendanceFields(formData);
  if ("error" in fields) {
    return { error: fields.error };
  }

  const week = attendanceWeek(fields.weekStart);
  const weekId = attendanceWeekId(week.start);
  const sheetUrl = `${ATTENDANCE_SITE_URL}/attendance/sheet/${weekId}`;

  let jpeg: ArrayBuffer;
  try {
    jpeg = await compressAttendanceSheet(sheet.file, await getImagesBinding());
  } catch (error) {
    console.error("Attendance sheet compress failed", error);
    return { error: "We couldn't shrink that photo. Try another picture." };
  }

  try {
    await writeAttendanceSheet(weekId, jpeg);
    await writeAttendanceSheetMeta(weekId, {
      weekStart: week.start,
      filename: sheet.file.name,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Attendance sheet store failed", error);
    return { error: "Uploads aren't configured yet." };
  }

  try {
    const message = buildReportEmail({
      week,
      santosDays: fields.santosDays,
      blancaDays: fields.blancaDays,
      comment: fields.comment,
      sheetUrl,
    });
    await sendRanchEmail(await getEmailSender(), {
      ...message,
      attachments: [jpegAttachment(jpeg, fields.weekStart)],
    });
  } catch (error) {
    console.error("Attendance email failed", error);
    return { error: "The report email didn't send. Try again in a minute." };
  }

  return { sent: true, weekId };
}
