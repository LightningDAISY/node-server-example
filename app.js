'use strict'
const http = require("http")
const www  = require("./lib/www")
const server = http.createServer()

server.on(
	"request",
	function(req,res)
	{
		if(www.isStaticRequest(req)) return www.staticRequest(req, res)
		res.writeHead(200, {"Content-Type": "text/plain"})
		res.end(www.config.server.port.toString())
	}
)

server.listen(www.config.server.port)

