'use strict'
const http = require("http")
const www  = require("./lib/www")
const server = http.createServer()

server.on(
	"request",
	function(req,res)
	{
		if(www.isStaticRequest(req)) return www.staticRequest(req, res)
		res.writeHead(200, {"Content-Type": "text/html"})
		// res.end(www.config.server.port.toString())
/*
		www.presenter.view.template.name = "example.mustache"
		www.presenter.view.template.stash = {
			"value1" : "A",
			"value2" : "B",
		}
*/
		res.end(
			www.presenter.view.render(
				process.cwd() + "/" + www.config.dir.presenter.view.template + "/example.mustache",
				{
					"value1" : "A",
					"value2" : "B",
				}
			)
		)
	}
)

server.listen(www.config.server.port)

