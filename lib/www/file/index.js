const fs = require("fs")

exports.path = ""
exports.init = function(args)
{
	this.path = args.path || args.dirName + "/" + args.fileName
	return this
}

exports.write = function(body)
{
	try
	{
		body = body.replace(/\r\n/g, "\n");
		body = body.replace(/\r/g, "\n");
		fs.writeFileSync(this.path, body)
	}
	catch(error)
	{
		throw(error)
	}
	return this
}


