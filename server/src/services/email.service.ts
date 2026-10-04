import {
  getMailAuthHelpMessage,
  getTransporter,
  isDevEmailBypassEnabled,
  isMailConfigured,
} from "../config/mail";

type SendVerificationOtpResult = {
  delivered: boolean;
  devLogged?: boolean;
};

export async function sendVerificationOtpEmail(
  email: string,
  otp: string,
): Promise<SendVerificationOtpResult> {
  if (isDevEmailBypassEnabled()) {
    console.info(`[DEV EMAIL] OTP for ${email}: ${otp}`);
    return { delivered: false, devLogged: true };
  }

  if (!isMailConfigured()) {
    throw new Error("Email service is not configured");
  }

  await getTransporter().sendMail({
    from: process.env.EMAIL_USER?.trim(),
    to: email,
    subject: "Verify your email",
    // text: `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        ">
          <div style="
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px 30px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          ">
            
            <h1 style="
              margin: 0 0 15px;
              color: #111827;
              font-size: 26px;
            ">
              Verify your email
            </h1>

            <p style="
              margin: 0 0 25px;
              color: #6b7280;
              font-size: 16px;
              line-height: 1.6;
            ">
              Thanks for signing up! Use the verification code below
              to verify your email address.
            </p>

            <div style="
              display: inline-block;
              padding: 15px 30px;
              margin: 10px 0 25px;
              background-color: #f3f4f6;
              border-radius: 8px;
            ">
              <span style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #111827;
              ">
                ${otp}
              </span>
            </div>

            <p style="
              margin: 0 0 10px;
              color: #6b7280;
              font-size: 14px;
            ">
              This OTP will expire in <strong>10 minutes</strong>.
            </p>

            <p style="
              margin: 25px 0 0;
              color: #9ca3af;
              font-size: 13px;
              line-height: 1.5;
            ">
              If you didn't request this verification code,
              you can safely ignore this email.
            </p>

          </div>

          <p style="
            text-align: center;
            margin-top: 20px;
            color: #9ca3af;
            font-size: 12px;
          ">
            © ${new Date().getFullYear()} Your App. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `,
  });

  return { delivered: true };
}

export function getEmailSendErrorMessage(error: unknown): string | null {
  const authError =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "EAUTH";

  if (authError) {
    return getMailAuthHelpMessage();
  }

  return null;
}
