const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.router     = require("www/router")
exports.config     = require("www/config").get()
const sprintf      = require("sprintf-js").sprintf

const fs   = require("fs")
const url  = require("url")

const dayNames   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// returns ex. "Wed, 21 Oct 2015 07:28:00 GMT"
function _date2datetime(date)
{
	return sprintf(
		"%s, %d %s %d %02d:%02d:%02d GMT",
		dayNames[date.getUTCDay()],
		date.getUTCDate(),
		monthNames[date.getUTCMonth()],
		date.getUTCFullYear(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	)
}

exports.isStaticRequest = function(req)
{
	const reqUrl = url.parse(req.url) // /abc/xyz.jpg?a=b -> /abc/xyz.jpg
	const regex = new RegExp(this.config.uri.static + "/")
	return reqUrl.pathname.match(regex) ? true : false
}

exports.staticRequest = function(req,res)
{
	const reqUrl = url.parse(req.url) // /abc/xyz.jpg?a=b -> /abc/xyz.jpg
	const filePath = decodeURI(
		baseDir + "/" + this.config.dir.static + reqUrl.pathname
	)
	console.log("requested " + filePath)
	// fs.access(filePath, fs.constants.F_OK, (notFound) => {
	fs.stat(filePath, (error, stat) => {
		if(error)
		{
			if(error.code == "ENOENT")
			{
				var requestUri = reqUrl.pathname
				    .replace("&", "&amp;")
				    .replace("<", "&lt;")
				    .replace(">", "&gt;")
				requestUri = decodeURI(requestUri)
				res.writeHead(404, {"Content-Type": "text/plain"})
				res.end(requestUri + " is not found")
				return
			}
			else
			{
				res.writeHead(500, {"Content-Type": "text/plain"})
				res.end("internal server error")
			}
		}
		res.setHeader("Content-Length", stat.size)
		res.setHeader("Last-Modified", _date2datetime(stat.ctime))
		const stream = fs.createReadStream(filePath)
		stream.pipe(res)
		stream.on("error", function(error) {
			res.writeHead(500, {"Content-Type": "text/plain"})
			res.end("internal server error")
		})
	})
}


