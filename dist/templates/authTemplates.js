export const resetPasswordTemplate = ({ resetLink, userName = "User", }) => {
    return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <table width="600" style="background:#fff; border-radius:8px; overflow:hidden;">
            
            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <h2>Reset Your Password</h2>

                <p>Hi ${userName},</p>

                <p>Click below to reset your password:</p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${resetLink}" 
                     style="background:#4f46e5; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px;">
                    Reset Password
                  </a>
                </div>

                <p style="font-size:12px;">
                  This link expires in 1 hour.
                </p>

                <p>If button doesn’t work:</p>
                <p style="word-break:break-all; color:#4f46e5;">
                  ${resetLink}
                </p>

                <p>Regards,<br/><b>Team ClickHr</b></p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f6f8; text-align:center; padding:15px; font-size:12px;">
                © 2026 Team ClickHr. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
//# sourceMappingURL=authTemplates.js.map