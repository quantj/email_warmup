const FUN_FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

function sendWarmupEmail() {
  const props = PropertiesService.getScriptProperties();

  const apiKey        = props.getProperty('OW_API_KEY');
  const mainTo        = props.getProperty('MAIN_TO');
  const fromName      = props.getProperty('FROM_NAME');
  const ccRecipients  = props.getProperty('CC_RECIPIENTS') || '';
  const bccRecipients = props.getProperty('BCC_RECIPIENTS') || '';

  if (!apiKey) throw new Error('Add OW_API_KEY to Script Properties first.');
  if (!mainTo) throw new Error('Add MAIN_TO to Script Properties first.');
  if (!fromName) throw new Error('Add FROM_NAME to Script Properties first.');

  // --- Get weather
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Montreal,CA&units=metric&appid=${apiKey}`;
  const weatherRes = UrlFetchApp.fetch(weatherUrl);
  const weather    = JSON.parse(weatherRes.getContentText());
  const temp       = Math.round(weather.main.temp);
  const conditions = weather.weather[0].description;
  const weatherSummary = `${temp}°C, ${conditions}`;

  // --- Get dad joke
  const jokeRes = UrlFetchApp.fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json', 'User-Agent': 'Warm-up Script (Google Apps Script)' }
  });
  const joke = JSON.parse(jokeRes.getContentText()).joke;

  // --- Format date
  const dateStr = Utilities.formatDate(new Date(), 'America/Toronto', 'MMMM d, yyyy');

  // --- Rotate subject line
  const subjectTemplates = [
    `${dateStr}'s weather: ${weatherSummary} — please reply!`,
    `Hey, Montreal's weather today is: ${weatherSummary} — please reply!`,
    `Weather check: ${weatherSummary}, ${dateStr} — please reply!`,
    `Inbox warm-up on ${dateStr} — please reply!`,
    `Joke for ${dateStr} — please reply!`
  ];
  const subject = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];

  // --- Fetch fun fact
  const funFactRes = UrlFetchApp.fetch(FUN_FACT_API);
  const funFactData = JSON.parse(funFactRes.getContentText());
  const funFact = funFactData.text;

  // --- Email body
  const body = `Hi team,

This email is automated to send regularly to help warmup our new email address. Please reply.

In the meantime, here's a new dad joke:
${joke}

Fun fact of the day:
${funFact}

Have a great day!

— ${fromName}'s bot`;

  // --- Send email
  GmailApp.sendEmail(mainTo, subject, body, {
    name: fromName,
    cc: ccRecipients,
    bcc: bccRecipients
  });
}
