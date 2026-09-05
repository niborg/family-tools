import { beforeEach, describe, expect, it, vi } from "vitest";

const isAuthenticated = vi.fn();
const getEmailSender = vi.fn();
const sendRanchEmail = vi.fn();

vi.mock("@/lib/auth", () => ({
  isAuthenticated: () => isAuthenticated(),
}));

vi.mock("@/lib/email", () => ({
  getEmailSender: () => getEmailSender(),
  sendRanchEmail: (...args: unknown[]) => sendRanchEmail(...args),
}));

import { submitAttendance } from "./attendance";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    data.set(name, value);
  }
  return data;
}

describe("submitAttendance", () => {
  const sender = { send: vi.fn() };

  beforeEach(() => {
    isAuthenticated.mockReset();
    getEmailSender.mockReset();
    sendRanchEmail.mockReset();
    getEmailSender.mockResolvedValue(sender);
    sendRanchEmail.mockResolvedValue(undefined);
  });

  it("asks the visitor to log in again when the session is gone", async () => {
    isAuthenticated.mockResolvedValue(false);

    await expect(submitAttendance(undefined, form({}))).resolves.toEqual({
      error: "Please log in again.",
    });
    expect(sendRanchEmail).not.toHaveBeenCalled();
  });

  it("rejects incomplete days before sending mail", async () => {
    isAuthenticated.mockResolvedValue(true);

    await expect(
      submitAttendance(
        undefined,
        form({ week: "2026-08-31", santosDays: "2", comment: "" }),
      ),
    ).resolves.toEqual({
      error: "Enter how many days each person worked, from 0 to 7.",
    });
    expect(sendRanchEmail).not.toHaveBeenCalled();
  });

  it("emails the report and returns sent", async () => {
    isAuthenticated.mockResolvedValue(true);

    await expect(
      submitAttendance(
        undefined,
        form({
          week: "2026-08-31",
          santosDays: "3",
          blancaDays: "4",
          comment: "All good.",
        }),
      ),
    ).resolves.toEqual({ sent: true });

    expect(sendRanchEmail).toHaveBeenCalledOnce();
    const [, message] = sendRanchEmail.mock.calls[0];
    expect(message).toMatchObject({
      to: "suzeadmin@gmail.com",
      from: "admin@ranch.knipe.io",
      subject: "Crew hours: week of 2026-08-31",
    });
    expect(message.text).toContain("Santos: 3 days");
    expect(message.text).toContain("All good.");
  });

  it("returns a friendly error when email is not configured", async () => {
    isAuthenticated.mockResolvedValue(true);
    getEmailSender.mockRejectedValue(new Error("EMAIL binding is missing"));

    await expect(
      submitAttendance(
        undefined,
        form({
          week: "2026-08-31",
          santosDays: "1",
          blancaDays: "1",
          comment: "",
        }),
      ),
    ).resolves.toEqual({
      error: "The report email didn't send. Try again in a minute.",
    });
  });
});
