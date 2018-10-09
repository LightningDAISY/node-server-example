const fs = require("fs")

exports.parseBody = function(body)
{
	const pairs = body.split("&")
	const parsed = new Object()
	for(var i=0; i<pairs.length; i++)
	{
		var pair = new Array()
		pair = pairs[i].split("=")
		pair[0] = pair[0].replace(/\+/g, " ")
		pair[1] = pair[1].replace(/\+/g, " ")
		parsed[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
	}
	return parsed
}

exports.saveFile = function(fileName, body)
{
	const path = this.config.dir.save + "/" + fileName
	if(!fs.existsSync(this.config.dir.save))
	{
		fs.writeFileSync(path, body)
		return 1
	}
}

