"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitAttendance } from "@/app/actions/attendance";
import { ATTENDANCE_COMMENT_MAX } from "@/lib/attendance";
import { compressPhotoForUpload } from "./compress-photo";

function formatBytes(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(0)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttendanceForm({ weekStart }: { weekStart: string }) {
  const [state, formAction, pending] = useActionState(
    submitAttendance,
    undefined,
  );
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [shrinking, setShrinking] = useState(false);

  async function assignFile(input: HTMLInputElement, file: File | undefined) {
    if (!file) {
      return;
    }
    setShrinking(true);
    const compressed = await compressPhotoForUpload(file);
    const transfer = new DataTransfer();
    transfer.items.add(compressed);
    input.files = transfer.files;
    setFileLabel(
      compressed.size === file.size
        ? `${compressed.name} · ${formatBytes(compressed.size)}`
        : `${compressed.name} · ${formatBytes(file.size)} → ${formatBytes(compressed.size)}`,
    );
    setShrinking(false);
  }

  if (state?.sent) {
    return (
      <div className="font-comic font-bold text-[#2d6a4f]" role="status">
        <p>Sent. Thank you — that report is on its way.</p>
        {state.weekId ? (
          <p className="mt-3">
            <Link
              className="text-sm text-(--accent) underline"
              href={`/attendance/sheet/${state.weekId}`}
            >
              Open this week&apos;s hours sheet →
            </Link>
          </p>
        ) : null}
      </div>
    );
  }

  const busy = pending || shrinking;

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
      <div className="flex flex-col gap-2 font-comic text-sm font-bold">
        Santos&apos;s hours sheet
        <label
          className={`flex min-h-36 cursor-pointer flex-col items-center justify-center px-4 py-8 text-center font-normal ${
            dragOver ? "ranch-drop-hot ranch-drop" : "ranch-drop"
          }`}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const input = event.currentTarget.querySelector("input");
            if (input) {
              void assignFile(input, event.dataTransfer.files[0]);
            }
          }}
        >
          <input
            accept="image/*"
            className="sr-only"
            name="sheet"
            onChange={(event) => {
              const input = event.currentTarget;
              void assignFile(input, input.files?.[0]);
            }}
            required
            type="file"
          />
          <span className="bounce-slow text-3xl" aria-hidden>
            📷
          </span>
          <span className="mt-2 font-comic text-sm font-bold">
            {shrinking
              ? "Shrinking that iPhone photo…"
              : (fileLabel ?? "Take a photo or choose one")}
          </span>
          <span className="mt-2 font-pixel text-base text-(--muted)">
            Required · we shrink it on the way
          </span>
        </label>
      </div>
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
      <button className="ranch-btn px-4 py-2.5" disabled={busy} type="submit">
        {pending ? "Sending the report…" : "Send the report"}
      </button>
    </form>
  );
}
