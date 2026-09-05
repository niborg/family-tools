import {
  ATTENDANCE_SITE_URL,
  attendanceFormUrl,
  attendanceWeek,
  buildReminderEmail,
  isPacificNoonWednesday,
} from "./attendance";
import { asEmailSender, sendRanchEmail } from "./email";

export async function sendWeeklyAttendanceReminder(env: {
  EMAIL?: unknown;
  ATTENDANCE_SITE_URL?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!isPacificNoonWednesday()) {
    return { sent: false, reason: "not-noon" };
  }

  const sender = asEmailSender(env.EMAIL);
  if (!sender) {
    console.error("EMAIL binding is missing");
    return { sent: false, reason: "no-email" };
  }

  const week = attendanceWeek();
  const siteUrl = env.ATTENDANCE_SITE_URL ?? ATTENDANCE_SITE_URL;
  await sendRanchEmail(
    sender,
    buildReminderEmail(week, attendanceFormUrl(siteUrl, week.start)),
  );
  return { sent: true };
}
