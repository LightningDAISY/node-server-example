const fs   = require("fs")
const url  = require("url")
const etag = require("etag")
const sprintf    = require("sprintf-js").sprintf
const dayNames   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const baseDir = process.cwd()

exports.init = function(req,res,config)
{
	exports.req = req
	exports.res = res
	exports.config = config
	return this
}

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

function _useCache(req,res,filePath,stat)
{
	const fileBody = fs.readFileSync(filePath)
	const fileEtag = etag(fileBody)
	if(_hitCache(req,fileEtag, stat))
	{
		res.writeHead(304, {"Content-Type": "text/plain"})
		res.end("Not Modified")
		return 1
	}
	else
	{
		res.setHeader("ETag", fileEtag)
		res.setHeader("Last-Modified", _date2datetime(stat.ctime))
		return 0
	}
}

function _dayNameIndex(dayName)
{
	for(var i=1; i<=7; i++)
	{
		if(dayNames[i - 1] == dayName) return i
	}
}

function _monthNameIndex(dayName)
{
	for(var i=1; i<=12; i++)
	{
		if(monthNames[i - 1] == dayName) return i
	}
}

function _datetime2Date(datetime)
{
	var dname, day, monthName, year, hour, minute, second
	dname, day, monthName, year, hour, minute, second = datetime.split(/\D+/)
	return new Date(
		sprintf(
			"%d-%02d-%02dT%02d:%02d:%02d",
			year, _monthNameIndex(monthName), day,
			hour, minute, second
		)
	)
}

function _hitCache(req,fileEtag,stat)
{
	const reqEtag0 = req.headers["If-None-Match"]
	if(reqEtag0 && fileEtag != reqEtag0) return 1
	const reqEtag1 = req.headers["If-Match"]
	if(reqEtag1 && fileEtag == reqEtag1) return 1
	const since = req.headers["If-Modified-Since"]
	if(since)
	{
		const sinceTime = _datetime2Date(since).getTime()
		if(sinceTime >= stat.ctime.getTime()) return 1
	}
	return 0
}

exports.response = function()
{
	const reqUrl = url.parse(this.req.url) // /abc/xyz.jpg?a=b -> /abc/xyz.jpg
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
				this.res.writeHead(404, {"Content-Type": "text/plain"})
				this.res.end(requestUri + " is not found")
				return
			}
			else
			{
				this.res.writeHead(500, {"Content-Type": "text/plain"})
				this.res.end("internal server error")
			}
		}
		if(_useCache(this.req,this.res,filePath,stat)) return
		this.res.setHeader("Content-Length", stat.size)
		const stream = fs.createReadStream(filePath)
		stream.pipe(this.res)
		stream.on("error", function(error) {
			this.res.writeHead(500, {"Content-Type": "text/plain"})
			this.res.end("internal server error")
		})
	})
}

