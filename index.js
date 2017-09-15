const path = require('path')
const fs = require('fs')
const cronJob = require('node-cron')
const collectorsDir = path.resolve('.', 'lib/collectors')

const token = process.env.SLACK_API_TOKEN || ''
const dataPath = process.env.DATA_PATH || '.'

const getCollectors = (dir) => {
  return new Promise((resolve, reject) => {
    return fs.readdir(dir, (err, files) => {
      if (err) return reject(err)
      resolve(files)
    })
  })
}

const printOKMessage = (fileName) => {
  console.dir('File updated')
}

const printKOMessage = (err) => {
  console.dir(err)
}

const runCollectors = () => {
  return getCollectors(collectorsDir)
    .then((files) => {
      files.forEach((collectorFile) => {
        const collector = require(path.resolve('./', collectorsDir, collectorFile))
        const instance = new collector(token, dataPath)

        instance.run()
            .then(printOKMessage)
            .catch(printKOMessage)
      })
    })
}

cronJob.schedule('*/5 * * * *', () => {
  console.log('Cron!')
  runCollectors()
})
