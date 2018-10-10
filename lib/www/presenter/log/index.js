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

function getV4Address(address)
{
	const addresses = address.split(":")
	return addresses.length ? addresses[3] : addresses[0]
}

function createLogMessage(req)
{
	return sprintf(
		"%s\t%s\t%s\t%s\t%s",
		getV4Address(req.connection.remoteAddress),
		req.connection.remotePort,
		req.method,
		req.url,
		req.headers["user-agent"]
	)
}

exports.access = async function(statusCode,req)
{
	if(!config.file.log.access) return
	const message = createLogMessage(req)
	if(!message) return
	const filePath = baseDir + "/" + config.dir.log + "/" + config.file.log.access
	fs.appendFile(filePath, logDate() + "\t" + statusCode + "\t" + message + "\n", function(error) {
		if(error) throw error
	})
}

console.log = async function(message)
{
	if(config.file.log.error) log("debug", message)
	originalLog(message)
}

console.warn = async function(message)
{
	if(config.file.log.error) log("warn", message)
	originalWarn(message)
}

console.error = async function(message)
{
	if(config.file.log.error) log("error", message)
	originalError(message)
}

