import { attendanceWeekStartFromId } from "@/lib/attendance";
import { readAttendanceSheet } from "@/lib/attendance-sheet";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ week: string }> },
) {
  if (!(await isAuthenticated())) {
    return new Response("Please log in.", { status: 401 });
  }

  const { week } = await params;
  if (!attendanceWeekStartFromId(week)) {
    return new Response("Not found", { status: 404 });
  }

  let bytes: ArrayBuffer | null;
  try {
    bytes = await readAttendanceSheet(week);
  } catch (error) {
    console.error("Attendance sheet image failed", error);
    return new Response("Uploads aren't configured yet.", { status: 503 });
  }

  if (!bytes) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
