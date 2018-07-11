//
// MMM-NotificationTrigger
//

"use strict"

const NodeHelper = require("node_helper");
const bodyParser = require("body-parser");


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
	}
})
