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
			if(!parsed || !parsed.name || !parsed.body)
			{
				console.log("invalid param")
				that.res.setHeader("Location", "/file/retry")
				that.res.statusCode = 302
				that.res.body = "error"
				that.res.writeHead(302, "temporary redirect")
			}
			else
			{
				that.file.init({
					fileName : parsed.name,
					dirName  : baseDir + "/" + that.config.dir.save,
				}).write(parsed.body)
				that.res.body = "saved"
			}
			that.res.end(that.res.body)
			that.presenter.view.log.access(that.res.statusCode, that.req)
		})
	}
	else
	{
		this.presenter.view.render(
			this.template.dir + "/form.mustache",
			{
				requestUri : "/file",
				requestMethod : "post",
			}
		)
	}
}

