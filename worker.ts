// @ts-expect-error `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { sendWeeklyAttendanceReminder } from "./lib/attendance-mail";

type WorkerEnv = {
  EMAIL?: unknown;
  ATTENDANCE_SITE_URL?: string;
};

export default {
  fetch: handler.fetch,

  async scheduled(_controller: unknown, env: WorkerEnv) {
    await sendWeeklyAttendanceReminder(env);
  },
};
