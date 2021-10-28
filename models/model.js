const fs = require('fs')
const appController = require('../controllers/controller')

class Model {
    async getFileContent(filePath) {
        let fileContent = await fs.promises.readFile(filePath, 'utf-8')
        return fileContent
    }
}

module.exports = new Model()