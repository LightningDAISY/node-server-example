const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.config     = require("www/config").get()
exports.router     = require("www/router")
exports.static     = require("www/static").init(this.config)
exports.presenter  = require("www/presenter").init(this.config)



