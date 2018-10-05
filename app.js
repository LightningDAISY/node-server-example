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
			if(controller)
			{
				controller.response()
			}
			else
			{
				res.writeHead(404, "not found")
				res.end("not found")
			}
		}
		catch(error)
		{
			console.error(error)
			res.writeHead(500, "internal server error")
			res.end("")
		}
	}
)

server.listen(www.config.server.port)

