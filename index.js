var WebClient = require('@slack/client').WebClient;
var fs = require('fs')


var token = process.env.SLACK_API_TOKEN || '';

var web = new WebClient(token);
web.team.accessLogs((err, res) => {
	if (err) return console.dir(err);
	fs.writeFile('test.json', JSON.stringify(res), (err) => {
		if (err) return console.dir(err)
		console.dir('write ok')
	})
});
