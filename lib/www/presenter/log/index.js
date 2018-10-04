const baseDir = process.cwd()
const fs = require("fs")
module.paths.unshift(baseDir + "/lib")
const config = require("www/config").get()
const sprintf = require("sprintf-js").sprintf

const originalLog   = console.log
const originalWarn  = console.warn
const originalError = console.error

function convertType(message)
{
	const type = typeof(message)
	if(message === null)
	{
		message = "(Null)"
	}
	else if(message === true)
	{
		message = "(True)"
	}
	else if(message === false)
	{
		message = "(False)"
	}
	else if(message === undefined)
	{
		message = "(Undefined)"
	}
	else if(type != "string" && type != "number")
	{
		return
	}
	return message
}

function logDate()
{
	const now = new Date()
	return sprintf(
		"%d-%02d-%02d %02d:%02d:%02d",
		now.getFullYear(),
		now.getMonth() + 1,
		now.getDate(),
		now.getHours(),
		now.getMinutes(),
		now.getSeconds()
	)
}

function log(level,message)
{
	message = convertType(message)
	if(!message) return
	const filePath = baseDir + "/" + config.dir.log + "/" + config.file.log.error
	fs.appendFile(filePath, logDate() + " [" + level + "] " + message + "\n", function(error) {
		if(error) throw error
	})
}

console.log = function(message)
{
	log("debug", message)
	originalLog(message)
}

console.warn = function(message)
{
	log("warn", message)
	originalWarn(message)
}

console.error = function(message)
{
	log("error", message)
	originalError(message)
}

