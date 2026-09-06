import Link from "next/link";
import {
  attendanceWeek,
  attendanceWeekStartFromId,
} from "@/lib/attendance";
import type { AttendanceSheetPublic } from "@/lib/attendance-sheet";

export function SheetList({ sheets }: { sheets: AttendanceSheetPublic[] }) {
  if (sheets.length === 0) {
    return null;
  }

  return (
    <section className="ranch-panel mt-6 px-6 py-6">
      <h3 className="ranch-title text-2xl">Past hours sheets</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {sheets.map((sheet) => {
          const start = attendanceWeekStartFromId(sheet.weekId);
          const label = start ? attendanceWeek(start).label : sheet.weekId;
          return (
            <li key={sheet.weekId}>
              <Link
                className="font-comic text-sm font-bold text-(--accent) underline"
                href={`/attendance/sheet/${sheet.weekId}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
