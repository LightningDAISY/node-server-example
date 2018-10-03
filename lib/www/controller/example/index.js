const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
const presenter = require("www/presenter")

exports.init = function(req,res,config)
{
	this.req    = req
	this.res    = res
	this.config = config
	return this
}

exports.response = function()
{
	this.res.writeHead(200, {"Content-Type": "text/html"})
	this.res.end(
		presenter.view.render(
			baseDir + "/" + this.config.dir.presenter.view.template + "/example.mustache",
			{
				"value1" : "A",
				"value2" : "B",
			}
		)
	)
}

