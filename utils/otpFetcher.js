const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

async function fetchLatestOTP({ email, password, subjectKeyword = 'OTP', sender = null }) {
  const config = {
    imap: {
      user: email,
      password: password,
      host: 'outlook.office365.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
    },
  };

  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');

  // Search for unseen emails with the subject containing the keyword
  const searchCriteria = ['UNSEEN'];
  const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
  const messages = await connection.search(searchCriteria, fetchOptions);

  for (const item of messages.reverse()) {
    const all = item.parts.find(part => part.which === 'HEADER');
    const subject = all.body.subject ? all.body.subject[0] : '';
    const from = all.body.from ? all.body.from[0] : '';
    if (subject.includes(subjectKeyword) && (!sender || from.includes(sender))) {
      const textPart = item.parts.find(part => part.which === 'TEXT');
      const parsed = await simpleParser(textPart.body);
      const otpMatch = parsed.text.match(/\b\d{4,8}\b/); // Adjust regex for your OTP format
      if (otpMatch) {
        await connection.end();
        return otpMatch[0];
      }
    }
  }

  await connection.end();
  throw new Error('OTP email not found');
}

module.exports = { fetchLatestOTP };
