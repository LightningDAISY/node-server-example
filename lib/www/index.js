const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.config = require("www/config").get()
exports.router = require("www/router").init(this.config)
exports.router.presenter = exports.presenter = require("www/presenter").init(this.config)

