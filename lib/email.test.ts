import { describe, expect, it, vi } from "vitest";
import { asEmailSender, sendRanchEmail } from "./email";

describe("asEmailSender", () => {
  it("accepts an object with send()", () => {
    const send = vi.fn();
    expect(asEmailSender({ send })).toEqual({ send });
    expect(asEmailSender({})).toBeUndefined();
    expect(asEmailSender(undefined)).toBeUndefined();
  });
});

describe("sendRanchEmail", () => {
  it("forwards the message to the binding", async () => {
    const send = vi.fn().mockResolvedValue({ messageId: "1" });
    const message = {
      to: "suzeadmin@gmail.com",
      from: "admin@ranch.knipe.io",
      subject: "Crew hours",
      text: "Santos: 2",
    };

    await sendRanchEmail({ send }, message);
    expect(send).toHaveBeenCalledWith(message);
  });
});
