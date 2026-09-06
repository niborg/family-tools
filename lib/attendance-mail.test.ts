import { afterEach, describe, expect, it, vi } from "vitest";
import { sendWeeklyAttendanceReminder } from "./attendance-mail";

describe("sendWeeklyAttendanceReminder", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does nothing when it is not 4pm Pacific on Wednesday", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T19:00:00.000Z"));
    const send = vi.fn();

    await expect(
      sendWeeklyAttendanceReminder({ EMAIL: { send } }),
    ).resolves.toEqual({ sent: false, reason: "not-four-pm" });
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the reminder at 4pm Pacific on Wednesday", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-09T23:00:00.000Z"));
    const send = vi.fn().mockResolvedValue({});

    await expect(
      sendWeeklyAttendanceReminder({
        EMAIL: { send },
        ATTENDANCE_SITE_URL: "https://ranch.knipe.io",
      }),
    ).resolves.toEqual({ sent: true });

    expect(send).toHaveBeenCalledOnce();
    const message = send.mock.calls[0][0];
    expect(message.to).toBe("susie.knipe@gmail.com");
    expect(message.from).toBe("admin@ranch.knipe.io");
    expect(message.text).toContain(
      "https://ranch.knipe.io/attendance?week=2026-09-07",
    );
  });
});
