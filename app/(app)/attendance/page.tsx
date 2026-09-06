import Link from "next/link";
import { attendanceWeek } from "@/lib/attendance";
import { listAttendanceSheets } from "@/lib/attendance-sheet";
import { AttendanceForm } from "./attendance-form";
import { SheetList } from "./sheet-list";

async function loadSheets() {
  try {
    return await listAttendanceSheets();
  } catch (error) {
    console.error("Attendance sheet list failed", error);
    return [];
  }
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const current = attendanceWeek(week);
  const sheets = await loadSheets();

  return (
    <main>
      <p className="mb-6">
        <Link className="ranch-link font-comic text-sm" href="/">
          ← back to the shed
        </Link>
      </p>
      <section className="ranch-panel relative px-6 py-8">
        <span className="new-burst absolute -top-2 right-4">NEW!!!</span>
        <h2 className="ranch-title text-3xl">Crew hours</h2>
        <p className="mt-2 mb-2 max-w-md font-comic font-bold text-(--muted)">
          How many days did Santos and Blanca work this week? Add a photo of
          Santos&apos;s hours sheet too.
        </p>
        <p className="mb-6 font-pixel text-lg text-(--ink)">{current.label}</p>
        <AttendanceForm weekStart={current.start} />
      </section>
      <SheetList sheets={sheets} />
    </main>
  );
}
