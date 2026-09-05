"use client";

import { useActionState } from "react";
import { submitAttendance } from "@/app/actions/attendance";
import { ATTENDANCE_COMMENT_MAX } from "@/lib/attendance";

export function AttendanceForm({ weekStart }: { weekStart: string }) {
  const [state, formAction, pending] = useActionState(
    submitAttendance,
    undefined,
  );

  if (state?.sent) {
    return (
      <p className="font-comic font-bold text-[#2d6a4f]" role="status">
        Sent. Thank you — that report is on its way.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input name="week" type="hidden" value={weekStart} />
      <label className="flex flex-col gap-2 font-comic text-sm font-bold">
        Days Santos worked
        <input
          className="ranch-input px-3 py-2.5 text-base font-normal"
          inputMode="numeric"
          max={7}
          min={0}
          name="santosDays"
          required
          step={1}
          type="number"
        />
      </label>
      <label className="flex flex-col gap-2 font-comic text-sm font-bold">
        Days Blanca worked
        <input
          className="ranch-input px-3 py-2.5 text-base font-normal"
          inputMode="numeric"
          max={7}
          min={0}
          name="blancaDays"
          required
          step={1}
          type="number"
        />
      </label>
      <label className="flex flex-col gap-2 font-comic text-sm font-bold">
        Anything of note?
        <textarea
          className="ranch-input min-h-28 px-3 py-2.5 text-base font-normal"
          maxLength={ATTENDANCE_COMMENT_MAX}
          name="comment"
          placeholder="Optional"
        />
      </label>
      {state?.error ? (
        <p className="font-comic text-sm font-bold text-(--danger)" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="ranch-btn px-4 py-2.5" disabled={pending} type="submit">
        {pending ? "Sending the report…" : "Send the report"}
      </button>
    </form>
  );
}
