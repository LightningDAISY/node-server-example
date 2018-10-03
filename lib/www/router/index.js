const url  = require("url")
const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")

exports.init = function(config)
{
	this.config = config
	return this
}

exports.isStaticRequest = function(req)
{
	const reqUrl = url.parse(req.url) // /abc/xyz.jpg?a=b -> /abc/xyz.jpg
	const regex = new RegExp(this.config.uri.static + "/")
	return reqUrl.pathname.match(regex) ? true : false
}

exports.routing = function(req,res)
{
	if(this.isStaticRequest(req))
	{
		console.log("is static!!")
		return require("www/controller/static").init(req,res,this.config)
	}
	return require("www/controller/example").init(req,res,this.config)
}
