const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.view = require("www/presenter/view")

exports.init = function(config)
{
	this.config = config || this.config
	this.view.config = this.config
	this.view.includeDir = baseDir + "/" + this.config.dir.presenter.view.include
	return this
}


