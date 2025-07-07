# Email Warm-up & Auto-Reply Scripts

This project contains Google Apps Script code to **warm up a new email account** by sending automated emails regularly to your internal team, and to **auto-reply to their replies**. This helps build sending reputation, improve deliverability, and avoid spam filters.

---

## Why warm up an email?

New or rarely used email accounts can be flagged as spam by providers (Gmail, Outlook, etc.) when sending bulk or automated emails.  
Warming up the email involves sending a consistent stream of emails with replies and engagement, ideally with natural conversations.

---

## What these scripts do

### 1. **sendWarmupEmail()**

- Sends an automated, friendly email to your team every few days.
- Email content includes:
  - A personalized weather update for Montreal fetched from OpenWeather API
  - A dad joke fetched from [icanhazdadjoke.com](https://icanhazdadjoke.com)
  - A fun fact from [uselessfacts.jsph.pl](https://uselessfacts.jsph.pl)
- Subject lines rotate to avoid repetition.
- Sends the email **to one main address**, with additional recipients on CC and BCC.
- The email requests a reply to simulate engagement.

### 2. **autoReplyWarmup()**

- Runs regularly to scan your inbox for replies from your warm-up contacts in the last 24 hours.
- For each eligible conversation, sends a natural reply selected randomly from a list of friendly messages.
- Ensures you don’t reply multiple times in the same thread.
- Helps simulate real conversation threads to improve email reputation.

---

## Setup Instructions

### 1. Add Script Properties

Go to your Apps Script project:

- Click **Project Settings** (gear icon)
- Click **Script Properties**
- Add the following key-value pairs:

| Key             | Description                                    | Example value                              |
|-----------------|------------------------------------------------|--------------------------------------------|
| `OW_API_KEY`    | Your OpenWeatherMap API key                     | `abcd1234efgh5678ijkl`                     |
| `MAIN_TO`       | The primary email address to send warm-up emails to (usually your own) | `tj@google.com`                            |
| `FROM_NAME`     | The “From” display name for sent emails        | `TJ`                                      |
| `CC_RECIPIENTS` | Comma-separated list of emails to CC in warm-up emails | `tj@gmail.com,alice@example.com`           |
| `BCC_RECIPIENTS`| Comma-separated list of emails to BCC in warm-up emails | `tj@hotmail.com,bob@example.com`           |

---

### 2. Deploy the scripts

- Copy the `sendWarmupEmail()` and `autoReplyWarmup()` functions into your Apps Script project.
- Grant permissions when prompted (access to Gmail, external APIs).
- Set up time-driven triggers:
  - For `sendWarmupEmail()`, set it to run every 2-3 days.
  - For `autoReplyWarmup()`, set it to run daily or every few hours.

---

## How to use

- The warm-up emails will be sent automatically on schedule.
- Your team members will receive them and are expected to reply (or your auto-reply script will reply for you).
- Auto-replies keep conversations going and simulate natural engagement.
- You can monitor sent emails and replies via your Gmail sent folder and inbox.

---

## Customizing the scripts

- **Reply templates:** Edit the `REPLY_TEMPLATES` array in `autoReplyWarmup()` to customize reply messages.
- **Subject lines:** Update the `subjectTemplates` array in `sendWarmupEmail()` for different subject variations.
- **Content:** You can extend the email body with additional APIs or messages.
- **Recipient lists:** Manage your `CC_RECIPIENTS` and `BCC_RECIPIENTS` in Script Properties anytime without changing code.

---

## Notes & Tips

- Keep your warm-up emails **human and light** — jokes and fun facts help.
- Avoid sending emails with **too many links** or spammy keywords.
- Use **personalized or rotating subject lines** to prevent spam filters from flagging.
- Your warm-up contacts should ideally be real people or internal team members.
- Make sure your auto-reply logic prevents infinite loops or duplicate replies.
- Monitor email reputation using tools like Google Postmaster Tools.

---

## Troubleshooting

- **API errors:** Make sure your OpenWeather API key is valid and has no restrictions.
- **Script errors:** Check execution logs in Apps Script dashboard.
- **Emails not sending:** Verify your Gmail quotas and permissions.
- **Recipients not replying:** Encourage team members to reply or rely on auto-replies.
