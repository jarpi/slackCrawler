const fs = require('fs')
const Path = require('path')
const collectorsDir = Path.resolve('.', 'lib/collectors')

// GET ALL PAGES FROM RESPONSE

const token = process.env.SLACK_API_TOKEN || '';

const getCollectors = (dir) => {
	return new Promise((resolve, reject) => {
		return fs.readdir(dir, (err, files) => {
			if (err) return reject(err)
			resolve(files)
		})
	})
}

const writeFile = (data, fileName) => {
	return new Promise((resolve, reject) => {
        const fileLog = fileName + '.' + Date.now() + '.json';
		return fs.writeFile(fileLog, JSON.stringify(data), (err) => {
			if (err) return reject(err)
			resolve(fileLog)
		})
	})
}

const printOKMessage = (fileName) => {
	console.dir(`File written to disk: ${fileName}`)
}

const printKOMessage = (err) => {
	console.dir(err)
}

getCollectors(collectorsDir)
.then(files => {
	files.forEach((collectorFile) => {
		const collector = require(Path.resolve('./', collectorsDir, collectorFile))
		collector(token)
		.then((data) => {
            const fileNameGroups = /([^\.]+)\./.exec(collectorFile)
            if (!fileNameGroups) throw new Error(collectorFile + ' invalid file name')
			return writeFile(data, fileNameGroups[1] || fileNameGroups[0])
		})
		.then(printOKMessage)
		.catch(printKOMessage)

	})
})
.catch((err) => {
	console.dir(err)
})
