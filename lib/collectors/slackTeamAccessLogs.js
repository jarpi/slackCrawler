const WebClient = require('@slack/client').WebClient;
const fs = require('fs')
const _ = require('lodash')
const readline = require('readline')

const defaults = {
  flags: 'a',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
};

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
            const data = res.logins.reduce((prev, curr) => {
              prev.push(JSON.stringify(curr))
              return prev
            },[])
            resolve(data)
        })
    })
  }

  writeFile(data) {
    return new Promise((resolve, reject) => {
      const fd = fs.createWriteStream(this.accessLogsFilename, defaults)
      data.forEach((loginItem) => {
        fd.write(loginItem + '\n')
      })
      resolve()
  	})
  }

  getOrCreateFileLog() {
    // use moment lib to create a timestamp of day/month/year/hours
    const fileName = 'slackTeamAccessLogs.' + new Date().getUTCHours() + '.json'
    if (!fs.existsSync(fileName)) fs.closeSync(fs.openSync(fileName, 'a'))
    return fileName
  }

  getDataFromFile() {
    const data = []
    return new Promise((resolve, reject) => {
      console.dir('getData')
      const rl = readline.createInterface({
        input: fs.createReadStream(this.accessLogsFilename)
      })
      rl.on('line', (line) => {
        data.push(line)
      })
      rl.on('close', ()=>{
        resolve(data)
      })
    })
  }

  merge(data) {
    return this.getDataFromFile()
    .then((dataFromFile) => {
      const diff = _.filter(data, (obj) => {
        const e =  _.find(dataFromFile, (o) => {
          return o === JSON.stringify(obj)
        })
        return e === undefined
      })
      .reduce((prev, curr)=>{
        prev.push(JSON.stringify(curr))
        return prev
      },[])
      console.dir('difference')
      console.dir(diff)
      return diff
    })
  }

  run() {
    return this.collectData()
    .then(this.merge.bind(this))
    .then(this.writeFile.bind(this))
  }

}

module.exports = AccessLogsCollector
