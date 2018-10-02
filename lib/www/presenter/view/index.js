const fs      = require("fs")
const mustache = require("mustache")
exports.template = {
	"stash"    : {},
	"filePath" : "",
}

exports.render = function(filePath, stash)
{
	stash    = stash || this.template.stash || {}
	filePath = filePath || this.template.filePath || ""
	const fileBody = fs.readFileSync(filePath, "utf8")
	return mustache.render(fileBody, stash)
}
