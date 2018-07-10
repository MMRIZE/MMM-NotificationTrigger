//
// Module : MMM-NotificationTrigger
//


Module.register("MMM-NotificationTrigger", {
	defaults: {
		useWebhook: false,
		triggers:[
			{
				trigger: "SAMPLE_INCOMINIG_NOTIFICATION",
				triggerSenderFilter: (sender) => {
					return true
				},
				triggerPayloadFilter: (payload) => {
					return true
				},
				fires: [
					{
						fire:"SAMPLE_OUTGOING_NOTIFICATION",
						payload: (payload) => {
							return payload
						},
						delay: 0,
					},
				],
			},
		]
	},

	start: function() {
		this.sendSocketNotification("INIT")
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "WEBHOOK" && this.config.useWebhook) {
			this.notificationReceived(payload.notification, payload.payload, payload.sender)
		}
	},

	notificationReceived: function (notification, payload, sender) {
		var triggers = this.config.triggers
		for(i in triggers) {

			var trigger = triggers[i]
			if (notification == trigger.trigger) {
				var senderFilter = (trigger.triggerSenderFilter)
					? trigger.triggerSenderFilter
					: this.defaults.triggers[0].triggerSenderFilter
				var payloadFilter = (trigger.triggerPayloadFilter)
					? trigger.triggerPayloadFilter
					: this.defaults.triggers[0].triggerPayloadFilter
				if (senderFilter(sender) && payloadFilter(payload)) {
					for(j in trigger.fires) {
						var fire = trigger.fires[j]
						var payloadResult = (fire.payload)
							? fire.payload
							: this.defaults.triggers[0].fires[0].payload
						if(fire.delay) {
							setTimeout(()=>{
								this.sendNotification(fire.fire, payloadResult(payload))
							}, fire.delay)
						} else {
							this.sendNotification(fire.fire, payloadResult(payload))
						}
					}
				}
			}
		}
	},
})
