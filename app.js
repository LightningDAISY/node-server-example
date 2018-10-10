'use strict'
const http = require("http")
const www  = require("./lib/www")
const server = http.createServer()

server.on(
	"request",
	function(req,res)
	{
		try
		{
			const controller = www.router.routing(req,res)
			res.statusCode = 200
			if(controller)
			{
				controller.response()
				controller.presenter.view.log.access(res.statusCode, controller.req)
			}
			else
			{
				res.statusCode = 404
				res.writeHead(res.statusCode, "not found")
				res.end("not found")
			}
		}
		catch(error)
		{
			console.error(error)
			res.statusCode = 500
			res.writeHead(res.statusCode, "internal server error")
			res.end("")
		}
	}
)

server.listen(www.config.server.port)

