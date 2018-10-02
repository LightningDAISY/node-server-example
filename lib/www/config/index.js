const fs      = require("fs")
const props   = require("props")

exports.get = function()
{
	const baseDir = process.cwd()
	const configPath = baseDir + "/" + "config.yml"
	const yamlData = fs.readFileSync(configPath, "utf8")
	return props(yamlData)
}


