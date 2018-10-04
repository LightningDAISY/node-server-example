const os = require("os")

function getUptime()
{
	const uptime = os.uptime()
	const sec = uptime % 60
	const min = parseInt(uptime % 3600 / 60)
	const hour = parseInt(uptime % (3600 * 24) / 3600)
	const day = parseInt(uptime / (3600 * 24))
	var result = ""
	if(day) result += day + "day "
	if(hour) result += hour + "hour "
	if(min) result += min + "min "
	if(sec) result += sec + "sec "
	return result
}

exports.response = function()
{
	this.res.writeHead(200, {"Content-Type": "text/html"})
	this.res.end(
		this.presenter.view.render(
			this.template.dir + "/index.mustache",
			{
				"cpus" : os.cpus(),
				"platform" : os.platform(),
				"release" : os.release(),
				"totalmem" : parseInt(os.totalmem() / 1024 / 1024),
				"freemem"  : parseInt(os.freemem() / 1024 / 1024),
				"uptime"   : getUptime(),
				"pid"      : process.pid,
				"ppid"     : process.ppid,
			}
		)
	)
}

