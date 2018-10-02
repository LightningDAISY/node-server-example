const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.view  = require("www/presenter/view")

exports.init = function(config)
{
	this.config = config
	return this
}


