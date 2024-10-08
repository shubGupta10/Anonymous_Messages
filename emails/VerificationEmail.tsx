const createEmailTemplate = (username: string, otp: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Hello ${username},</h2>
        <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export default createEmailTemplate;