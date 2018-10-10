const sprintf = require("sprintf-js").sprintf

const Env = new Map()

exports.init = function(conf,req)
{
	if(Env.has("basedir")) { return Env }

	// basedir
	const basedir = process.cwd()

	Env.set("basedir", basedir)

	// date
	const now = new Date()
	Env.set("date", now)

	// datetime
	Env.set(
		"datetime", sprintf(
			"%d-%02d-%02d %02d:%02d:%02d",
			now.getFullYear(),
			now.getMonth() + 1,
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds()
		)
	)

	// publicdir
	Env.set("staticdir", basedir + "/" + conf.dir.static)

	// savedir
	Env.set("savedir", basedir + "/" + conf.dir.save)

	// accesslog
	Env.set("accesslog", basedir + "/" + conf.dir.log + "/" + conf.file.log.access)

	// errorlog
	Env.set("errorlog", basedir + "/" + conf.dir.log + "/" + conf.file.log.error)

	// templatedir
	Env.set("templatedir", basedir + "/" + conf.dir.presenter.view.template)

	return Env
}
