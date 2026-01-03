/* globals Log Module */

Module.register("MMM-NotificationTrigger", {
	defaults: {
		useWebhook: false,
		triggers: [
			{
				trigger: "SAMPLE_INCOMING_NOTIFICATION",
				triggerSenderFilter: () => true,
				triggerPayloadFilter: () => true,
				fires: [
					{
						fire: "SAMPLE_OUTGOING_NOTIFICATION",
						payload: payload => payload,
						delay: 0,
						exec: ""
					},
				],
			},
		]
	},

	start: function () {
		this.sendSocketNotification("INIT")
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "WEBHOOK" && this.config.useWebhook) {
			this.notificationReceived(payload.notification, payload.payload, payload.sender)
		}
		if (notification === "EXEC_RESULT") {
			this.sendNotification(`${payload.fire}_RESULT`, payload)
			Log.log("[NOTTRG] Execution Result: ", payload)
		}
	},

	notificationReceived: function (notification, payload, sender) {
		const { triggers } = this.config
		for (const i in triggers) {
			const trigger = triggers[i]
			if (notification === trigger.trigger) {
				const senderFilter = (trigger.triggerSenderFilter)
					? trigger.triggerSenderFilter
					: this.defaults.triggers[0].triggerSenderFilter
				const payloadFilter = (trigger.triggerPayloadFilter)
					? trigger.triggerPayloadFilter
					: this.defaults.triggers[0].triggerPayloadFilter
				if (senderFilter(sender) && payloadFilter(payload)) {
					for (const j in trigger.fires) {
						const fire = trigger.fires[j]
						let payloadResult = payload
						if (typeof fire.payload === "function") {
							payloadResult = fire.payload(payload)
						}
						else if (fire.payload) {
							payloadResult = fire.payload
						}
						let execResult = fire.exec
						if (execResult && typeof execResult === "function") {
							execResult = execResult(payload)
						}
						if (fire.delay) {
							setTimeout((fire, trigger, payload, exec) => {
								this.sendNotification(fire, payload)
								Log.log(`[NOTTRG] ${fire.fire} is emitted.`)
								if (exec) {
									this.sendSocketNotification("EXEC", {
										trigger: trigger,
										fire: fire,
										exec: exec
									})
								}
							}, fire.delay, fire.fire, trigger.trigger, payloadResult, execResult)
						}
						else {
							this.sendNotification(fire.fire, payloadResult)
							Log.log(`[NOTTRG] ${fire.fire} is emitted.`)
							if (execResult) {
								this.sendSocketNotification("EXEC", {
									trigger: trigger.trigger,
									fire: fire.fire,
									exec: execResult
								})
							}
						}
					}
				}
			}
		}
	},
})
