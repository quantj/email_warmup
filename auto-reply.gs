/************  CONFIG  ************/
const REPLY_TEMPLATES = [
  "Thanks replying",
  "Appreciate the reply",
  "Got it, cheers!",
  "thanks!",
  "All set on my end."
];

/************  HELPERS  ************/
function normalize(email) {
  // lower-case and strip any “+tag” before @
  return email.trim().toLowerCase().replace(/\+[^@]+(?=@)/, '');
}

function getWarmupContacts() {
  const props = PropertiesService.getScriptProperties();
  const mainTo = props.getProperty('MAIN_TO') || '';
  const cc     = props.getProperty('CC_RECIPIENTS') || '';
  const bcc    = props.getProperty('BCC_RECIPIENTS') || '';

  // Split CC and BCC strings by comma, trim spaces, and filter out empties
  const ccList  = cc.split(',').map(s => s.trim()).filter(Boolean);
  const bccList = bcc.split(',').map(s => s.trim()).filter(Boolean);

  // Combine all contacts into one array, plus mainTo
  return [mainTo, ...ccList, ...bccList]
    .map(normalize)
    .filter(email => email.length > 0);
}

function contactsQuery() {
  // build from:(a OR b OR c)
  const contacts = getWarmupContacts();
  const joined = contacts.join(' OR ');
  return `from:(${joined})`;
}

/************  MAIN JOB  ************/
function autoReplyWarmup() {
  const myEmail = normalize(Session.getActiveUser().getEmail());
  const query   = `${contactsQuery()} newer_than:1d in:inbox`;
  const threads = GmailApp.search(query, 0, 500);

  let replyCount = 0;

  threads.forEach(thread => {
    const msgs = thread.getMessages();
    const lastMsg = msgs[msgs.length - 1];                 // newest message in thread
    const lastSender = normalize(lastMsg.getFrom().replace(/.*<|>.*/g, ''));

    // 1) Last sender must be a warm-up contact
    if (!getWarmupContacts().includes(lastSender)) return;

    // 2) Make sure YOU started the thread (at least one older msg from you)
    const threadStartedByMe = msgs.some(m => {
      const sender = normalize(m.getFrom().replace(/.*<|>.*/g, ''));
      return sender === myEmail && m.getDate() < lastMsg.getDate();
    });
    if (!threadStartedByMe) return;

    // 3) Make sure you haven't replied AFTER this contact's latest message
    const iHaveRepliedAfter = msgs.some(m => {
      const sender = normalize(m.getFrom().replace(/.*<|>.*/g, ''));
      return sender === myEmail && m.getDate() > lastMsg.getDate();
    });
    if (iHaveRepliedAfter) return;

    // 4) Send natural reply
    const randomReply = REPLY_TEMPLATES[Math.floor(Math.random() * REPLY_TEMPLATES.length)];
    thread.reply(randomReply);
    replyCount++;
  });

  Logger.log(`Auto-replied to ${replyCount} warm-up message${replyCount !== 1 ? 's' : ''}.`);
}
