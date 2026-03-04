import { test, expect } from "@playwright/test";
import { MailService } from "../../src/services/MailService";

let mail: MailService;

test.beforeAll(async () => {
  mail = await MailService.createEthereal();
});

test.afterAll(() => {
  mail.close();
});

test.describe("Mail Service", () => {
  test("SMTP connection is valid", { tag: ["@smoke"] }, async () => {
    const connected = await mail.verifyConnection();
    expect(connected, "Ethereal SMTP connection should succeed").toBe(true);
  });

  test(
    "Send an email and verify it is accepted",
    { tag: ["@smoke", "@regression"] },
    async () => {
      const result = await mail.sendMail({
        from: mail.senderAddress,
        to: "recipient@example.com",
        subject: "Test Email — Plain Text",
        text: "This is a test email sent from Playwright.",
      });

      expect(
        result.messageId,
        "Sent email should have a message ID",
      ).toBeTruthy();
      expect(
        result.accepted,
        "Recipient should be in the accepted list",
      ).toContain("recipient@example.com");
      expect(result.rejected.length, "No recipients should be rejected").toBe(
        0,
      );
      expect(
        result.previewUrl,
        "Ethereal should return a preview URL",
      ).toBeTruthy();

      console.log(`Preview: ${result.previewUrl}`);
    },
  );

  test(
    "Send email to multiple recipients",
    { tag: ["@regression"] },
    async () => {
      const recipients = "user1@example.com, user2@example.com";
      const result = await mail.sendMail({
        from: mail.senderAddress,
        to: recipients,
        subject: "Test Email — Multiple Recipients",
        text: "This email was sent to multiple recipients.",
      });

      expect(
        result.messageId,
        "Sent email should have a message ID",
      ).toBeTruthy();
      expect(result.accepted.length, "Both recipients should be accepted").toBe(
        2,
      );
      expect(result.rejected.length, "No recipients should be rejected").toBe(
        0,
      );
    },
  );
});
