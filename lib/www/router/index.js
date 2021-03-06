const url = require("url")
const fs  = require("fs")
const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
const routes = {}

exports.init = function(config)
{
	this.config = config
	return this
}

exports.isStaticRequest = function(reqUri)
{
	const regex = new RegExp("^" + this.config.uri.static + "/")
	return reqUri.pathname.match(regex) ? true : false
}

exports.findController = function(req,res)
{
	const reqUri = url.parse(req.url) // /abc/xyz.jpg?a=b -> /abc/xyz.jpg
	if(routes[reqUri.pathname]) return routes[reqUri.pathname]
	const controllerDir = this.config.dir.controller
	const paths = reqUri.pathname.split("/")
	paths.shift()
	if(this.isStaticRequest(reqUri))
	{
		return {
			"path" : baseDir + "/" + controllerDir + "/static/index.js",
			"args" : [],
			"classPath" : paths.join("/"),
		}
	}
	var controllerPath = new String()
	const controllerArgs = new Array()
	for(var i=paths.length; i; i--)
	{
		controllerPath = baseDir + "/" + controllerDir + "/" + paths.join("/") + "/index.js"
		try
		{
			fs.accessSync(controllerPath, fs.constants.R_OK)
			routes[reqUri.pathname] = {
				"path"      : controllerPath,
				"args"      : controllerArgs,
				"classPath" : paths.join("/"),
			}
			break
		}
		catch(error)
		{
			controllerArgs.push(paths.pop())
		}
	}
	if(routes[reqUri.pathname]) return routes[reqUri.pathname]
}

exports.routing = function(req,res)
{
	res.headers = new Object()
	const controller = this.findController(req,res)
	req.setEncoding(this.config.default.encoding)
	if(controller)
	{
		const active = require(controller.path)
		active.req       = req
		active.res       = res
		active.config    = this.config
		active.args      = controller.args.reverse()
		active.file      = require("www/file")
		active.env       = require("www/env").init(this.config, req)
		active.__proto__ = require("www/controller/base")
		active.presenter = this.presenter
		active.presenter.view.req = req
		active.presenter.view.res = res
		active.template  = {
			"dir" : baseDir + "/" + this.config.dir.presenter.view.template + "/" + controller.classPath,
		}
		return active
	}
	this.presenter.view.log.access(404, req)
	return
}
