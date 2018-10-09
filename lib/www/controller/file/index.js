"use strict"
const baseDir = process.cwd()
exports.response = function()
{
	if(this.req.method == "POST")
	{
		let body = ""
		const that = this
		this.req.on("data", chunk => {
			body += chunk.toString()
		})
		this.req.on("end", function() {
			const parsed = that.parseBody(body)
			if(!parsed.name || !parsed.body)
			{
				console.log("invalid param")
				console.log(parsed)
				that.res.setHeader("Location", "/file/retry")
				that.res.writeHead(302, "temporary redirect")
				that.res.end("Method " + that.req.method)
				return
			}
			that.file.init({
				fileName : parsed.name,
				dirName  : baseDir + "/" + that.config.dir.save,
			}).write(parsed.body)
			that.res.end(parsed.body)
		})
	}
	else
	{
		this.presenter.view.render(
			this.template.dir + "/form.mustache",
			{

			}
		)
	}
}

