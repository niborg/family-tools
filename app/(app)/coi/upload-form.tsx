"use client";

import { useActionState, useState } from "react";
import { uploadCoi } from "@/app/actions/coi";

export function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadCoi, undefined);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function assignFile(input: HTMLInputElement, file: File | undefined) {
    if (!file) {
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    setFileName(file.name);
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center px-4 py-8 text-center ${
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
            assignFile(input, event.dataTransfer.files[0]);
          }
        }}
      >
        <input
          accept="application/pdf,.pdf"
          className="sr-only"
          name="file"
          onChange={(event) => {
            setFileName(event.target.files?.[0]?.name ?? null);
          }}
          type="file"
        />
        <span className="bounce-slow text-3xl" aria-hidden>
          🌾
        </span>
        <span className="mt-2 font-comic text-sm font-bold">
          {fileName ?? "Drop a PDF here, or click to choose one"}
        </span>
        <span className="mt-2 font-pixel text-base text-(--muted)">
          PDF, up to 10 MB · hay bales extra
        </span>
      </label>
      {state?.error ? (
        <p className="font-comic text-sm font-bold text-(--danger)" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="ranch-btn px-4 py-2.5" disabled={pending} type="submit">
        {pending ? "Loading the wagon…" : "Upload and review"}
      </button>
    </form>
  );
}
