const fs = require('fs')
const path = require('path')

const filePath = process.argv[2]
const COLUMN_SEPARATOR = ';'
const LINES_SEPARATOR = '\n'

const appModel = require('../models/model')

class Controller {
    async csvToJson() {
        try {
            const isExist = !!(await fs.promises.stat(filePath).catch(e => false))
            if (isExist) {
                const ext = path.extname(filePath)
                if (ext === '.csv') {
                    let fileContent = await appModel.getFileContent(filePath)
                    const lines = fileContent.split(LINES_SEPARATOR)
                    lines.pop()
                    const headers = lines[0].split(COLUMN_SEPARATOR)
                    const result = []

                    lines.forEach(el => {
                        let currentLine = el
                        let curLineLength = currentLine.split(COLUMN_SEPARATOR).length
                        if (headers.length !== curLineLength)
                            validCSV = false
                    });

                    for (const line of lines) {
                        let objToPush = {}
                        let currentLine = line.split(COLUMN_SEPARATOR)
                        for (let j = 0; j < headers.length; j++) {
                            currentLine[j] = currentLine[j].trim()
                            if (currentLine[j] === '\r') currentLine[j] = ''
                            if (headers[j] === '\r') headers[j] = ''
                            objToPush[headers[j]] = currentLine[j]
                        }
                        result.push(objToPush)
                    }

                    fileContent = JSON.stringify(result)
                    const currentFilePath = path.normalize(this.createNewFile())
                    fs.writeFile(currentFilePath, fileContent, () => { })
                } else {
                    this.throwError('Wrong extension!', 9)
                }

            } else {
                this.throwError('File not found!', 9)
            }

        } catch (e) {
            console.error(e.message)
            process.exit(e.code)
        }
    }

    createNewFile() {
        const fileName = path.basename(filePath, '.csv')
        const currentFilePath = path.dirname(filePath)
        const jsonFilePath = path.join(currentFilePath, fileName + '.json')
        console.log(jsonFilePath);
        fs.open(jsonFilePath, 'w', () => { })
        return jsonFilePath
    }

    throwError(message, code) {
        const error = new Error(message)
        error.code = code
        throw error
    }
}

module.exports = new Controller()