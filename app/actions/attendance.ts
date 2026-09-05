"use server";

import {
  attendanceWeek,
  buildReportEmail,
  readAttendanceFields,
} from "@/lib/attendance";
import { isAuthenticated } from "@/lib/auth";
import { getEmailSender, sendRanchEmail } from "@/lib/email";

export type AttendanceState = {
  error?: string;
  sent?: boolean;
};

export async function submitAttendance(
  _prev: AttendanceState | undefined,
  formData: FormData,
): Promise<AttendanceState> {
  if (!(await isAuthenticated())) {
    return { error: "Please log in again." };
  }

  const fields = readAttendanceFields(formData);
  if ("error" in fields) {
    return { error: fields.error };
  }

  try {
    await sendRanchEmail(
      await getEmailSender(),
      buildReportEmail({
        week: attendanceWeek(fields.weekStart),
        santosDays: fields.santosDays,
        blancaDays: fields.blancaDays,
        comment: fields.comment,
      }),
    );
  } catch (error) {
    console.error("Attendance email failed", error);
    return { error: "The report email didn't send. Try again in a minute." };
  }

  return { sent: true };
}
