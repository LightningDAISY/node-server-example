const baseDir = process.cwd()
module.paths.unshift(baseDir + "/lib")
exports.log = require("www/presenter/log")

const fs      = require("fs")
const mustache = require("mustache")
exports.template = {
	"stash"        : {},
	"filePath"     : "",
}

exports.statusCode = 200
const headers = { "Content-Type": "text/html" }

exports.header = function(key,value)
{
	if(key) { headers[key] = value } else { return headers[key] }
}

exports.render = function(filePath, stash)
{
	stash = stash || this.template.stash || {}
	filePath = filePath || this.template.filePath || ""
	const includeDir = this.includeDir
	stash.include = function()
	{
		return function(fileName)
		{
			fileName += ".mustache"
			const includeBody = fs.readFileSync(includeDir + "/" + fileName, "utf8")
			return mustache.render(includeBody, stash)
		}
	}
	const fileBody = fs.readFileSync(filePath, "utf8")
	if(this.statusCode)
	{
		//this.headers = mergeObjects(this,headers, this.res.headers)
		this.log.access(this.statusCode, this.req)
		this.res.writeHead(this.statusCode, this.headers)
		for(key in this.res.headers)
		{
			this.res.setHeader(key, this.res.headers[key])
		}
		this.res.end(mustache.render(fileBody, stash))
	}
}
