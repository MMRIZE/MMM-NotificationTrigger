//
// MMM-NotificationTrigger
//

"use strict"

const NodeHelper = require("node_helper")
const bodyParser = require("body-parser")
const exec = require('child_process').exec


module.exports = NodeHelper.create({
	start: function() {
		this.expressApp.use(bodyParser.json())
		this.expressApp.use(bodyParser.urlencoded({extended: true}))

		this.expressApp.post("/webhook", (req, res) => {
			console.log("reqpost?", req.body)
			this.sendSocketNotification("WEBHOOK", req.body)
			res.status(200).send({status: 200})
		})
		this.expressApp.get("/webhook", (req, res) => {
			console.log("reqget?", req.body)
			this.sendSocketNotification("WEBHOOK", req.body)
			res.status(200).send({status: 200})
		})
	},

	socketNotificationReceived: function(noti, payload) {
		if (noti == "EXEC") {
			exec(payload.exec, (error, stdout, stderr)=>{
				this.sendSocketNotification("EXEC_RESULT", {
					"trigger": payload.trigger,
					"fire": payload.fire,
					"error": error,
					"stdout": stdout,
					"stderr": stderr
				})
				if (error) {
			    console.error(`[NOTTRG] exec error: ${error}`);
			    return;
			  }
			  console.log(`[NOTTRG] stdout: ${stdout}`);
			  console.log(`[NOTTRG] stderr: ${stderr}`);
			})
		}
	}
})
