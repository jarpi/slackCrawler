const accessLogsCollector = require('./lib/collectors/slackTeamAccessLogs.js')

const token = process.env.SLACK_API_TOKEN || '';

new accessLogsCollector(token).run()
