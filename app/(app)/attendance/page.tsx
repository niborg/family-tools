import Link from "next/link";
import { attendanceWeek } from "@/lib/attendance";
import { AttendanceForm } from "./attendance-form";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const current = attendanceWeek(week);

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
          How many days did Santos and Blanca work this week?
        </p>
        <p className="mb-6 font-pixel text-lg text-(--ink)">{current.label}</p>
        <AttendanceForm weekStart={current.start} />
      </section>
    </main>
  );
}
