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
		fs.writeFileSync(this.path, body)
	}
	catch(error)
	{
		throw(error)
	}
	return this
}


