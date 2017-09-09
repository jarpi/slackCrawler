var WebClient = require('@slack/client').WebClient;

var token = process.env.SLACK_API_TOKEN || '';

var web = new WebClient(token);
web.team.accessLogs(function(err, res) {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Message sent: ', res);
  }
});
