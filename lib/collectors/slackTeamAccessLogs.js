var WebClient = require('@slack/client').WebClient;
var fs = require('fs')
var _ = require('lodash')

class AccessLogsCollector {
  constructor(token) {
    this.accessLogsFilename = this.getOrCreateFileLog()
    this.slackClient = new WebClient(token)
  }

  collectData() {
    return new Promise((resolve, reject) => {
        return this.slackClient.team.accessLogs((err, res) => {
            console.dir('Collect data')
            if (err) return reject(err)
            resolve(res)
        })
    })
  }

  writeFile(data, accessLogsFilename) {
    return new Promise((resolve, reject) => {
  		return fs.writeFile(accessLogsFilename, JSON.stringify(data.logins), (err) => {
        console.dir('Write data')
  			if (err) return reject(err)
  			resolve()
  		})
  	})
  }

  getOrCreateFileLog() {
    const fileName = 'slackTeamAccessLogs.' + new Date().getUTCHours() + '.json'
    if (!fs.existsSync(fileName)) fs.closeSync(fs.openSync(fileName, 'a'))
    return fileName
  }

  merge() {
    fileArr.push(_.difference())
  }

  run() {
    return this.collectData()
    .then((data) => {
      return this.writeFile(data, this.accessLogsFilename)
    })
  }

}

module.exports = AccessLogsCollector
