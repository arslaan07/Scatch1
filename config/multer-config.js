const multer = require('multer')

// Memory storage configuration
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

module.exports = uploadMemory