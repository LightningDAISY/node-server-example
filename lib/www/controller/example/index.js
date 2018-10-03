exports.response = function()
{
	this.res.writeHead(200, {"Content-Type": "text/html"})
	this.res.end(
		this.presenter.view.render(
			this.template.dir + "/index.mustache",
			{
				"value1" : "A",
				"value2" : "B",
				"args"   : this.args,
			}
		)
	)
}

