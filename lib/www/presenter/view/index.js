const baseDir = process.cwd()
const fs      = require("fs")
const mustache = require("mustache")
exports.template = {
	"stash"        : {},
	"filePath"     : "",
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
	return mustache.render(fileBody, stash)
}
