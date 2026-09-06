import Link from "next/link";
import { notFound } from "next/navigation";
import {
  attendanceWeek,
  attendanceWeekStartFromId,
} from "@/lib/attendance";
import { readAttendanceSheet } from "@/lib/attendance-sheet";

export default async function AttendanceSheetPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week: weekId } = await params;
  const weekStart = attendanceWeekStartFromId(weekId);
  if (!weekStart) {
    notFound();
  }

  let jpeg: ArrayBuffer | null;
  try {
    jpeg = await readAttendanceSheet(weekId);
  } catch (error) {
    console.error("Attendance sheet read failed", error);
    return (
      <main>
        <p className="mb-6">
          <Link className="ranch-link font-comic text-sm" href="/attendance">
            ← back to crew hours
          </Link>
        </p>
        <section className="ranch-panel px-6 py-8">
          <h2 className="ranch-title text-2xl">This sheet is unavailable</h2>
          <p className="mt-3 font-comic font-bold text-(--danger)" role="alert">
            Uploads aren&apos;t configured yet.
          </p>
        </section>
      </main>
    );
  }

  if (!jpeg) {
    notFound();
  }

  const week = attendanceWeek(weekStart);

  return (
    <main>
      <p className="mb-6">
        <Link className="ranch-link font-comic text-sm" href="/attendance">
          ← back to crew hours
        </Link>
      </p>
      <section className="ranch-panel px-6 py-8">
        <h2 className="ranch-title text-3xl">Santos&apos;s hours sheet</h2>
        <p className="mt-2 mb-6 font-pixel text-lg text-(--ink)">{week.label}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Santos hours sheet"
          className="w-full rounded-sm border-4 border-(--wood) bg-[#fff8dc]"
          src={`/attendance/sheet/${weekId}/image`}
        />
      </section>
    </main>
  );
}
