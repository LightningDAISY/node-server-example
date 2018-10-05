exports.response = function()
{
	this.presenter.view.render(
		this.template.dir + "/index.mustache",
		{
			"value1" : "A",
			"value2" : "B",
			"args"   : this.args,
		}
	)
}

